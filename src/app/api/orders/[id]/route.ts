import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { NotFoundError, AuthorizationError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = await params

    const order = await prisma.order.findUnique({
      where: { id, deletedAt: null },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                imageUrl: true,
                bottleSizeMl: true,
                alcoholPercentage: true,
              },
            },
          },
        },
        retailer: {
          select: {
            id: true,
            displayName: true,
            logoUrl: true,
            phone: true,
            addressLine1: true,
            addressCity: true,
          },
        },
        deliveryAddress: true,
        payments: {
          select: { id: true, amount: true, method: true, status: true, createdAt: true },
        },
        delivery: {
          include: {
            agent: {
              include: {
                user: { select: { id: true, name: true, phone: true } },
              },
            },
          },
        },
        customer: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (
      authUser.role === 'CUSTOMER' &&
      order.customerId !== authUser.userId
    ) {
      throw new AuthorizationError('You can only view your own orders')
    }

    if (authUser.role === 'RETAILER_OWNER' || authUser.role === 'RETAILER_STAFF') {
      const retailer = await prisma.retailer.findFirst({
        where: {
          id: order.retailerId,
          OR: [
            { ownerId: authUser.userId },
            { staff: { some: { userId: authUser.userId } } },
          ],
        },
      })

      if (!retailer) {
        throw new AuthorizationError('Access denied to this order')
      }
    }

    return successResponse(order)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
