import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, AuthorizationError, NotFoundError } from '@/lib/errors'

const VALID_TRANSITIONS: Record<string, string[]> = {
  CREATED: ['PAYMENT_PENDING', 'CANCELLED'],
  PAYMENT_PENDING: ['PAID', 'CANCELLED', 'FAILED'],
  PAID: ['COMPLIANCE_CHECK', 'CANCELLED'],
  COMPLIANCE_CHECK: ['RETAILER_ACCEPTED', 'REJECTED'],
  RETAILER_ACCEPTED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY_FOR_PICKUP'],
  READY_FOR_PICKUP: ['DELIVERY_ASSIGNED'],
  DELIVERY_ASSIGNED: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERY_VERIFICATION'],
  DELIVERY_VERIFICATION: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
  REJECTED: [],
  REFUNDED: [],
  FAILED: [],
}

const RETAILER_ALLOWED_TRANSITIONS: Record<string, string[]> = {
  COMPLIANCE_CHECK: ['RETAILER_ACCEPTED', 'REJECTED'],
  RETAILER_ACCEPTED: ['PREPARING'],
  PREPARING: ['READY_FOR_PICKUP'],
}

const DELIVERY_ALLOWED_TRANSITIONS: Record<string, string[]> = {
  DELIVERY_ASSIGNED: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERY_VERIFICATION'],
  DELIVERY_VERIFICATION: ['DELIVERED'],
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = await params
    const body = await request.json()
    const { status: newStatus, reason } = body as { status: string; reason?: string }

    if (!newStatus) {
      throw new ValidationError('Status is required')
    }

    const order = await prisma.order.findUnique({
      where: { id, deletedAt: null },
      include: {
        retailer: { select: { id: true, ownerId: true } },
        items: true,
      },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    const allowedTransitions = VALID_TRANSITIONS[order.status] || []
    if (!allowedTransitions.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition from ${order.status} to ${newStatus}. Allowed: ${allowedTransitions.join(', ')}`
      )
    }

    if (authUser.role === 'RETAILER_OWNER' || authUser.role === 'RETAILER_STAFF') {
      const retailerAllowed = RETAILER_ALLOWED_TRANSITIONS[order.status] || []
      if (!retailerAllowed.includes(newStatus)) {
        throw new AuthorizationError('Retailers cannot perform this status transition')
      }

      if (authUser.role === 'RETAILER_OWNER' && order.retailer.ownerId !== authUser.userId) {
        const isStaff = await prisma.retailerStaff.findFirst({
          where: { retailerId: order.retailer.id, userId: authUser.userId },
        })
        if (!isStaff) {
          throw new AuthorizationError('Not authorized for this retailer')
        }
      }
    }

    if (authUser.role === 'DELIVERY_AGENT') {
      const deliveryAgent = await prisma.deliveryAgent.findFirst({
        where: { userId: authUser.userId },
      })

      if (!deliveryAgent) {
        throw new AuthorizationError('Not a delivery agent')
      }

      const delivery = await prisma.delivery.findFirst({
        where: { orderId: order.id, agentId: deliveryAgent.id },
      })

      if (!delivery) {
        throw new AuthorizationError('Not assigned to this delivery')
      }

      const deliveryAllowed = DELIVERY_ALLOWED_TRANSITIONS[order.status] || []
      if (!deliveryAllowed.includes(newStatus)) {
        throw new AuthorizationError('Delivery agents cannot perform this status transition')
      }
    }

    if (authUser.role === 'ADMIN' || authUser.role === 'SUPER_ADMIN') {
      // Admins can perform any valid transition
    } else if (authUser.role === 'CUSTOMER') {
      if (newStatus !== 'CANCELLED') {
        throw new AuthorizationError('Customers can only cancel orders')
      }
      const cancellableStatuses = ['CREATED', 'PAYMENT_PENDING', 'RETAILER_ACCEPTED']
      if (!cancellableStatuses.includes(order.status)) {
        throw new ValidationError('Order cannot be cancelled at this stage')
      }
    }

    const updateData: Record<string, unknown> = { status: newStatus }

    if (newStatus === 'CANCELLED') {
      updateData.cancelledAt = new Date()
      updateData.cancelReason = reason || 'Cancelled by user'

      for (const item of order.items) {
        await prisma.inventory.update({
          where: { productId: item.productId },
          data: {
            reservedQuantity: { decrement: item.quantity },
          },
        })
      }
    }

    if (newStatus === 'DELIVERED') {
      updateData.actualDeliveryAt = new Date()

      for (const item of order.items) {
        await prisma.inventory.update({
          where: { productId: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            reservedQuantity: { decrement: item.quantity },
          },
        })
      }

      await prisma.retailer.update({
        where: { id: order.retailerId },
        data: { totalOrders: { increment: 1 } },
      })
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: 'ORDER_STATUS_UPDATE',
        entityType: 'ORDER',
        entityId: id,
        metadata: {
          previousStatus: order.status,
          newStatus,
          reason,
        },
      },
    })

    return successResponse(updatedOrder, 'Order status updated')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
