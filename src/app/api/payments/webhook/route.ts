import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import crypto from 'crypto'

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'webhook-secret-change-in-production'

function verifyWebhookSignature(payload: string, signature: string): boolean {
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex')

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-webhook-signature') || ''

    if (!verifyWebhookSignature(body, signature)) {
      return errorResponse(new Error('Invalid webhook signature'), 401)
    }

    const event = JSON.parse(body)
    const { eventType, paymentId, status, providerTransactionId, metadata } = event

    if (!eventType || !paymentId) {
      return errorResponse(new Error('Missing required fields'), 400)
    }

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    })

    if (!payment) {
      return errorResponse(new Error('Payment not found'), 404)
    }

    const paymentStatusMap: Record<string, string> = {
      'payment.success': 'SUCCESS',
      'payment.failed': 'FAILED',
      'payment.authorized': 'AUTHORIZED',
      'payment.captured': 'SUCCESS',
      'payment.refunded': 'REFUNDED',
    }

    const newPaymentStatus = paymentStatusMap[eventType] || status

    if (!newPaymentStatus) {
      return errorResponse(new Error('Unknown event type'), 400)
    }

    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: newPaymentStatus as 'INITIATED' | 'PENDING' | 'AUTHORIZED' | 'SUCCESS' | 'FAILED' | 'REFUND_PENDING' | 'REFUNDED',
        providerTransactionId: providerTransactionId || payment.providerTransactionId,
        metadata: {
          ...(payment.metadata as Record<string, unknown> || {}),
          webhookEvent: eventType,
          webhookTimestamp: new Date().toISOString(),
        },
      },
    })

    if (newPaymentStatus === 'SUCCESS') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'PAID' },
      })
    } else if (newPaymentStatus === 'FAILED') {
      const order = payment.order

      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'FAILED' },
      })

      const orderItems = await prisma.orderItem.findMany({
        where: { orderId: payment.orderId },
      })

      for (const item of orderItems) {
        await prisma.inventory.update({
          where: { productId: item.productId },
          data: {
            reservedQuantity: { decrement: item.quantity },
          },
        })
      }
    } else if (newPaymentStatus === 'REFUNDED') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { status: 'REFUNDED' },
      })
    }

    await prisma.auditLog.create({
      data: {
        actorId: null,
        actorRole: 'SYSTEM',
        action: 'PAYMENT_WEBHOOK',
        entityType: 'PAYMENT',
        entityId: paymentId,
        metadata: {
          eventType,
          paymentStatus: newPaymentStatus,
          orderId: payment.orderId,
          orderStatus: newPaymentStatus === 'SUCCESS' ? 'PAID' : payment.order.status,
        },
      },
    })

    return successResponse({ received: true })
  } catch (error) {
    return errorResponse(error as Error)
  }
}
