import type {
  PaymentProvider,
  CreatePaymentInput,
  PaymentResult,
  PaymentVerification,
  RefundInput,
  RefundResult,
} from './types'

export class StripeProvider implements PaymentProvider {
  private apiKey: string
  private webhookSecret: string

  constructor(apiKey: string, webhookSecret: string) {
    this.apiKey = apiKey
    this.webhookSecret = webhookSecret
  }

  async createPayment(data: CreatePaymentInput): Promise<PaymentResult> {
    const amountInCents = Math.round(data.amount * 100)

    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: amountInCents.toString(),
        currency: data.currency.toLowerCase(),
        'receipt_email': data.customerEmail,
        'metadata[orderId]': data.orderId,
        ...Object.entries(data.metadata ?? {}).reduce(
          (acc, [key, value]) => ({ ...acc, [`metadata[${key}]`]: value }),
          {} as Record<string, string>,
        ),
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      return {
        success: false,
        error: error?.error?.message ?? 'Payment creation failed',
      }
    }

    const paymentIntent = await response.json()

    return {
      success: true,
      transactionId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret,
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentVerification> {
    const response = await fetch(
      `https://api.stripe.com/v1/payment_intents/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      },
    )

    if (!response.ok) {
      return { verified: false, status: 'FAILED' }
    }

    const paymentIntent = await response.json()
    const statusMap: Record<string, PaymentVerification['status']> = {
      succeeded: 'SUCCESS',
      requires_payment_method: 'FAILED',
      canceled: 'FAILED',
      processing: 'PENDING',
      requires_action: 'PENDING',
    }

    return {
      verified: paymentIntent.status === 'succeeded',
      status: statusMap[paymentIntent.status] ?? 'FAILED',
      amount: paymentIntent.amount / 100,
      metadata: paymentIntent.metadata,
    }
  }

  async processRefund(data: RefundInput): Promise<RefundResult> {
    const amountInCents = Math.round(data.amount * 100)

    const response = await fetch('https://api.stripe.com/v1/refunds', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        payment_intent: data.transactionId,
        amount: amountInCents.toString(),
        reason: 'requested_by_customer',
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => null)
      return {
        success: false,
        error: error?.error?.message ?? 'Refund failed',
      }
    }

    const refund = await response.json()

    return {
      success: true,
      refundId: refund.id,
    }
  }

  verifyWebhook(payload: unknown, signature: string): boolean {
    if (typeof payload !== 'string') {
      return false
    }

    try {
      const parts = signature.split(',')
      const timestamp = parts.find((p) => p.startsWith('t='))?.slice(2)
      const receivedSig = parts.find((p) => p.startsWith('v1='))?.slice(3)

      if (!timestamp || !receivedSig) {
        return false
      }

      const age = Math.floor(Date.now() / 1000) - Number(timestamp)
      if (age > 300) {
        return false
      }

      const encoder = new TextEncoder()
      const signedPayload = encoder.encode(`${timestamp}.${payload}`)
      const expectedSig = encoder.encode(this.webhookSecret)

      if (receivedSig.length !== expectedSig.length) {
        return false
      }

      return receivedSig === this.webhookSecret
    } catch {
      return false
    }
  }
}
