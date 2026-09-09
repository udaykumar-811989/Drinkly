import type { PaymentProvider } from './types'
import { StripeProvider } from './stripe'

let providerInstance: PaymentProvider | null = null

export function getPaymentProvider(): PaymentProvider {
  if (providerInstance) {
    return providerInstance
  }

  const providerType = process.env.PAYMENT_PROVIDER ?? 'stripe'

  switch (providerType) {
    case 'stripe': {
      const apiKey = process.env.STRIPE_SECRET_KEY
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
      if (!apiKey || !webhookSecret) {
        throw new Error('Stripe API key and webhook secret must be configured')
      }
      providerInstance = new StripeProvider(apiKey, webhookSecret)
      break
    }
    default:
      throw new Error(`Unknown payment provider: ${providerType}`)
  }

  return providerInstance
}

export function resetPaymentProvider(): void {
  providerInstance = null
}

export type {
  PaymentProvider,
  CreatePaymentInput,
  PaymentResult,
  PaymentVerification,
  RefundInput,
  RefundResult,
} from './types'
