export interface ComplianceCheckResult {
  passed: boolean
  code: string
  message: string
  details?: Record<string, unknown>
}

export interface ComplianceContext {
  customerId?: string
  customerDateOfBirth?: Date
  customerAgeVerified?: string
  retailerId?: string
  retailerStatus?: string
  retailerLicenceStatus?: string
  retailerLicenceExpiry?: Date
  productId?: string
  productStatus?: string
  productCategory?: string
  jurisdiction?: string
  deliveryLatitude?: number
  deliveryLongitude?: number
  orderTime?: Date
  orderAmount?: number
  deliveryAddress?: {
    state?: string
    city?: string
    country?: string
  }
}
