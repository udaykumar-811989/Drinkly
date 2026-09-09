import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { complianceRuleSchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'
import { NotFoundError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['ADMIN', 'SUPER_ADMIN', 'COMPLIANCE_OFFICER'])

    const searchParams = request.nextUrl.searchParams
    const jurisdiction = searchParams.get('jurisdiction')
    const ruleType = searchParams.get('ruleType')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = {}

    if (jurisdiction) where.jurisdiction = jurisdiction
    if (ruleType) where.ruleType = ruleType
    if (status) where.status = status

    const [rules, total] = await Promise.all([
      prisma.complianceRule.findMany({
        where,
        include: {
          creator: { select: { id: true, name: true } },
          updater: { select: { id: true, name: true } },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.complianceRule.count({ where }),
    ])

    return paginatedResponse(rules, total, page, limit)
  } catch (error) {
    return errorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireRole(request, ['ADMIN', 'SUPER_ADMIN'])
    const data = await validateBody(request, complianceRuleSchema)

    const jurisdiction = await prisma.jurisdiction.findFirst({
      where: { code: data.jurisdiction },
    })

    if (!jurisdiction) {
      throw new NotFoundError(`Jurisdiction "${data.jurisdiction}" not found`)
    }

    const existingRule = await prisma.complianceRule.findFirst({
      where: {
        jurisdictionId: jurisdiction.id,
        ruleType: data.ruleType,
        status: 'ACTIVE',
      },
    })

    let rule

    if (existingRule) {
      rule = await prisma.complianceRule.update({
        where: { id: existingRule.id },
        data: {
          ruleValue: data.ruleValue,
          effectiveFrom: data.effectiveFrom,
          effectiveUntil: data.effectiveUntil || null,
          updatedBy: authUser.userId,
        },
        include: {
          creator: { select: { id: true, name: true } },
          updater: { select: { id: true, name: true } },
        },
      })
    } else {
      rule = await prisma.complianceRule.create({
        data: {
          jurisdictionId: jurisdiction.id,
          jurisdiction: data.jurisdiction,
          ruleType: data.ruleType,
          ruleValue: data.ruleValue,
          effectiveFrom: data.effectiveFrom,
          effectiveUntil: data.effectiveUntil || null,
          status: 'ACTIVE',
          createdBy: authUser.userId,
          updatedBy: authUser.userId,
        },
        include: {
          creator: { select: { id: true, name: true } },
          updater: { select: { id: true, name: true } },
        },
      })
    }

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: existingRule ? 'COMPLIANCE_RULE_UPDATED' : 'COMPLIANCE_RULE_CREATED',
        entityType: 'COMPLIANCE_RULE',
        entityId: rule.id,
        metadata: {
          jurisdiction: data.jurisdiction,
          ruleType: data.ruleType,
          isUpdate: !!existingRule,
        },
      },
    })

    return successResponse(
      rule,
      existingRule ? 'Compliance rule updated' : 'Compliance rule created',
      existingRule ? 200 : 201
    )
  } catch (error) {
    return errorResponse(error as Error)
  }
}
