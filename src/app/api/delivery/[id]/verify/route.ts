import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, AuthorizationError, NotFoundError } from '@/lib/errors'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = await params

    const body = await request.json()
    const {
      customerId,
      verificationType,
      idDocumentUrl,
      idDocumentType,
      isVerified,
      notes,
    } = body as {
      customerId: string
      verificationType: string
      idDocumentUrl?: string
      idDocumentType?: string
      isVerified: boolean
      notes?: string
    }

    if (!customerId || !verificationType || typeof isVerified !== 'boolean') {
      throw new ValidationError('customerId, verificationType, and isVerified are required')
    }

    if (isVerified && (!idDocumentUrl || !idDocumentType)) {
      throw new ValidationError('idDocumentUrl and idDocumentType are required when verifying')
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: { order: true },
    })

    if (!delivery) {
      throw new NotFoundError('Delivery not found')
    }

    if (delivery.status !== 'PICKED_UP' && delivery.status !== 'IN_TRANSIT') {
      throw new ValidationError('Delivery must be in transit for verification')
    }

    if (delivery.order.customerId !== customerId) {
      throw new ValidationError('customerId does not match order customer')
    }

    const deliveryAgent = await prisma.deliveryAgent.findFirst({
      where: { userId: authUser.userId },
    })

    if (!deliveryAgent || deliveryAgent.id !== delivery.agentId) {
      throw new AuthorizationError('Not authorized for this delivery')
    }

    const verification = await prisma.deliveryVerification.create({
      data: {
        deliveryId: id,
        orderId: delivery.orderId,
        customerId,
        verificationType,
        idDocumentUrl: idDocumentUrl || null,
        idDocumentType: idDocumentType || null,
        isVerified,
        verifiedBy: authUser.userId,
        verifiedAt: isVerified ? new Date() : null,
        notes,
      },
    })

    if (isVerified) {
      await prisma.customerProfile.update({
        where: { userId: customerId },
        data: {
          ageVerified: 'VERIFIED',
          verificationMethod: 'DELIVERY_AGENT',
          verificationReference: id,
        },
      })
    }

    await prisma.order.update({
      where: { id: delivery.orderId },
      data: { status: 'DELIVERY_VERIFICATION' },
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: 'DELIVERY_VERIFICATION',
        entityType: 'DELIVERY',
        entityId: id,
        metadata: {
          customerId,
          verificationType,
          isVerified,
          orderId: delivery.orderId,
        },
      },
    })

    return successResponse(verification, 'Verification recorded', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
