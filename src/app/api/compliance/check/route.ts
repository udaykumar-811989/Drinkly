import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { runComplianceCheck, ComplianceCheckType } from '@/lib/compliance/engine'
import { ComplianceContext } from '@/lib/compliance/types'
import { ValidationError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()

    const {
      customerId,
      retailerId,
      jurisdiction,
      deliveryLatitude,
      deliveryLongitude,
      orderAmount,
      productId,
      checks,
    } = body as {
      customerId?: string
      retailerId?: string
      jurisdiction?: string
      deliveryLatitude?: number
      deliveryLongitude?: number
      orderAmount?: number
      productId?: string
      checks?: ComplianceCheckType[]
    }

    if (!checks || !Array.isArray(checks) || checks.length === 0) {
      throw new ValidationError('At least one check type is required')
    }

    const context: ComplianceContext = {
      customerId: customerId || authUser.userId,
      retailerId,
      jurisdiction,
      deliveryLatitude,
      deliveryLongitude,
      orderTime: new Date(),
      orderAmount,
      productId,
    }

    if (customerId || authUser.userId) {
      const cid = customerId || authUser.userId
      const profile = await prisma.customerProfile.findUnique({
        where: { userId: cid },
      })
      if (profile) {
        context.customerDateOfBirth = profile.dateOfBirth
        context.customerAgeVerified = profile.ageVerified
      }
    }

    if (retailerId) {
      const retailer = await prisma.retailer.findUnique({
        where: { id: retailerId },
        include: { licences: true },
      })
      if (retailer) {
        context.retailerStatus = retailer.status
        const activeLicence = retailer.licences.find((l) => l.verificationStatus === 'VERIFIED')
        context.retailerLicenceStatus = activeLicence?.verificationStatus || 'NONE'
        context.retailerLicenceExpiry = activeLicence?.expiryDate
      }
    }

    if (productId) {
      const product = await prisma.product.findUnique({
        where: { id: productId },
        include: { category: true },
      })
      if (product) {
        context.productStatus = product.status
        context.productCategory = product.category.name
      }
    }

    const { passed, results } = await runComplianceCheck(context, checks)

    return successResponse({
      passed,
      results,
      context: {
        customerId: context.customerId,
        retailerId: context.retailerId,
        jurisdiction: context.jurisdiction,
        orderAmount: context.orderAmount,
      },
    })
  } catch (error) {
    return errorResponse(error as Error)
  }
}
