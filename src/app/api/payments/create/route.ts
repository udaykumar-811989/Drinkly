import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, NotFoundError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()
    const { orderId, method } = body as { orderId: string; method: string }

    if (!orderId || !method) {
      throw new ValidationError('orderId and method are required')
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId, deletedAt: null },
    })

    if (!order) {
      throw new NotFoundError('Order not found')
    }

    if (order.customerId !== authUser.userId) {
      throw new ValidationError('Order does not belong to this user')
    }

    if (order.status !== 'PAYMENT_PENDING') {
      throw new ValidationError(`Order status is ${order.status}, expected PAYMENT_PENDING`)
    }

    const existingPayment = await prisma.payment.findFirst({
      where: {
        orderId,
        status: { in: ['INITIATED', 'PENDING', 'AUTHORIZED', 'SUCCESS'] },
      },
    })

    if (existingPayment) {
      throw new ValidationError('Payment already exists for this order')
    }

    const payment = await prisma.payment.create({
      data: {
        orderId,
        amount: order.totalAmount,
        currency: 'INR',
        method,
        status: 'INITIATED',
        metadata: {
          orderNumber: order.orderNumber,
          customerId: authUser.userId,
        },
      },
    })

    const paymentIntent = {
      id: payment.id,
      amount: Number(payment.amount),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      clientSecret: `pi_${payment.id}_secret`,
    }

    return successResponse(paymentIntent, 'Payment initiated', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
