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
      throw new AuthorizationError('Only delivery agents can complete deliveries')
    }

    const deliveryAgent = await prisma.deliveryAgent.findFirst({
      where: { userId: authUser.userId },
    })

    if (!deliveryAgent) {
      throw new NotFoundError('Delivery agent profile not found')
    }

    const delivery = await prisma.delivery.findUnique({
      where: { id },
      include: {
        order: { include: { items: true } },
        verifications: true,
      },
    })

    if (!delivery) {
      throw new NotFoundError('Delivery not found')
    }

    if (delivery.agentId !== deliveryAgent.id) {
      throw new AuthorizationError('Not assigned to this delivery')
    }

    if (delivery.status !== 'IN_TRANSIT' && delivery.status !== 'DELIVERED') {
      throw new ValidationError(`Delivery status is ${delivery.status}, expected IN_TRANSIT`)
    }

    const hasVerified = delivery.verifications.some((v) => v.isVerified)
    if (!hasVerified) {
      throw new ValidationError('Customer verification must be completed before delivery')
    }

    const body = await request.json().catch(() => ({}))
    const { actualMinutes } = body as { actualMinutes?: number }

    const completedDelivery = await prisma.$transaction(async (tx) => {
      const del = await tx.delivery.update({
        where: { id },
        data: {
          status: 'DELIVERED',
          deliveredAt: new Date(),
          actualMinutes: actualMinutes || null,
        },
      })

      await tx.order.update({
        where: { id: delivery.orderId },
        data: {
          status: 'DELIVERED',
          actualDeliveryAt: new Date(),
        },
      })

      for (const item of delivery.order.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            reservedQuantity: { decrement: item.quantity },
          },
        })
      }

      await tx.retailer.update({
        where: { id: delivery.order.retailerId },
        data: { totalOrders: { increment: 1 } },
      })

      await tx.deliveryAgent.update({
        where: { id: deliveryAgent.id },
        data: {
          isAvailable: true,
          currentOrderId: null,
          totalDeliveries: { increment: 1 },
        },
      })

      return del
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: 'DELIVERY_COMPLETED',
        entityType: 'DELIVERY',
        entityId: id,
        metadata: {
          orderId: delivery.orderId,
          actualMinutes,
        },
      },
    })

    return successResponse(completedDelivery, 'Delivery completed successfully')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
