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

    if (authUser.role !== 'DELIVERY_AGENT') {
      throw new AuthorizationError('Only delivery agents can confirm pickup')
    }

    const deliveryAgent = await prisma.deliveryAgent.findFirst({
      where: { userId: authUser.userId },
    })

    if (!deliveryAgent) {
      throw new NotFoundError('Delivery agent profile not found')
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id },
    })

    if (!delivery) {
      throw new NotFoundError('Delivery not found')
    }

    if (delivery.agentId !== deliveryAgent.id) {
      throw new AuthorizationError('Not assigned to this delivery')
    }

    if (delivery.status !== 'ASSIGNED' && delivery.status !== 'ACCEPTED') {
      throw new ValidationError(`Delivery status is ${delivery.status}, expected ASSIGNED or ACCEPTED`)
    }

    const updatedDelivery = await prisma.$transaction(async (tx) => {
      const del = await tx.delivery.update({
        where: { id },
        data: {
          status: 'PICKED_UP',
          pickupAt: new Date(),
        },
      })

      await tx.order.update({
        where: { id: delivery.orderId },
        data: { status: 'PICKED_UP' },
      })

      return del
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: 'DELIVERY_PICKUP',
        entityType: 'DELIVERY',
        entityId: id,
        metadata: { orderId: delivery.orderId },
      },
    })

    return successResponse(updatedDelivery, 'Pickup confirmed')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
