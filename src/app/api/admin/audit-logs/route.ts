import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    await requireRole(request, ['ADMIN', 'SUPER_ADMIN'])

    const searchParams = request.nextUrl.searchParams
    const actorId = searchParams.get('actorId')
    const action = searchParams.get('action')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = {}

    if (actorId) where.actorId = actorId
    if (action) where.action = action
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) (where.createdAt as Record<string, Date>).gte = new Date(startDate)
      if (endDate) (where.createdAt as Record<string, Date>).lte = new Date(endDate)
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        include: {
          actor: {
            select: { id: true, name: true, email: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.auditLog.count({ where }),
    ])

    return paginatedResponse(logs, total, page, limit)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
