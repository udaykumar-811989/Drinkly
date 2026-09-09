import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, NotFoundError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const { orderId, agentId } = body as { orderId: string; agentId: string }

    if (!orderId) {
      throw new ValidationError('orderId is required')
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, deletedAt: null },
      include: {
        retailer: { select: { id: true, latitude: true, longitude: true } },
        deliveryAddress: { select: { latitude: true, longitude: true } },
      },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.status !== 'READY_FOR_PICKUP') {
      throw new ValidationError(`Order status is ${order.status}, expected READY_FOR_PICKUP`)
    }

    const existingDelivery = await prisma.delivery.findFirst({
      where: { orderId },
    })

    if (existingDelivery) {
      throw new ValidationError('Delivery already assigned for this order')
    }

    let deliveryAgent

    if (agentId) {
      deliveryAgent = await prisma.deliveryAgent.findUnique({
        where: { id: agentId },
      })

      if (!deliveryAgent) {
        throw new NotFoundError('Delivery agent not found')
      }

      if (deliveryAgent.status !== 'ACTIVE') {
        throw new ValidationError('Delivery agent is not active')
      }

      if (!deliveryAgent.isAvailable) {
        throw new ValidationError('Delivery agent is not available')
      }
    } else {
      deliveryAgent = await prisma.deliveryAgent.findFirst({
        where: {
          status: 'ACTIVE',
          isAvailable: true,
          deletedAt: null,
        },
        orderBy: { rating: 'desc' },
      })

      if (!deliveryAgent) {
        throw new ValidationError('No delivery agents available')
      }
    }

    const delivery = await prisma.$transaction(async (tx) => {
      const newDelivery = await tx.delivery.create({
        data: {
          orderId,
          agentId: deliveryAgent.id,
          status: 'ASSIGNED',
          pickupLatitude: order.retailer.latitude,
          pickupLongitude: order.retailer.longitude,
        },
      })

      await tx.deliveryAgent.update({
        where: { id: deliveryAgent.id },
        data: {
          isAvailable: false,
          currentOrderId: orderId,
        },
      })

      await tx.order.update({
        where: { id: orderId },
        data: { status: 'DELIVERY_ASSIGNED' },
      })

      return newDelivery
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: 'DELIVERY_ASSIGNED',
        entityType: 'DELIVERY',
        entityId: delivery.id,
        metadata: {
          orderId,
          agentId: deliveryAgent.id,
          agentName: deliveryAgent.userId,
        },
      },
    })

    return successResponse(delivery, 'Delivery assigned successfully', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
