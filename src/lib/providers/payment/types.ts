export interface PaymentProvider {
  createPayment(data: CreatePaymentInput): Promise<PaymentResult>
  verifyPayment(transactionId: string): Promise<PaymentVerification>
  processRefund(data: RefundInput): Promise<RefundResult>
  verifyWebhook(payload: unknown, signature: string): boolean
}

export interface CreatePaymentInput {
  orderId: string
  amount: number
  currency: string
  customerEmail: string
  customerPhone: string
  metadata?: Record<string, string>
}

export interface PaymentResult {
  success: boolean
  transactionId?: string
  clientSecret?: string
  redirectUrl?: string
  error?: string
}

export interface PaymentVerification {
  verified: boolean
  status: 'SUCCESS' | 'FAILED' | 'PENDING'
  amount?: number
  metadata?: Record<string, unknown>
}

export interface RefundInput {
  transactionId: string
  amount: number
  reason: string
}

export interface RefundResult {
  success: boolean
  refundId?: string
  error?: string
}
