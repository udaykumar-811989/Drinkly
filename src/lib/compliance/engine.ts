import { prisma } from '../prisma'
import { ComplianceContext, ComplianceCheckResult } from './types'
import * as rules from './rules'

export type ComplianceCheckType =
  | 'AGE_VERIFICATION'
  | 'JURISDICTION'
  | 'RETAILER_LICENSE'
  | 'PRODUCT_ELIGIBILITY'
  | 'DRY_DAY'
  | 'OPERATING_HOURS'
  | 'DELIVERY_LOCATION'
  | 'ORDER_LIMITS'

const RULE_MAP: Record<
  ComplianceCheckType,
  (ctx: ComplianceContext) => Promise<ComplianceCheckResult>
> = {
  AGE_VERIFICATION: rules.checkAgeVerification,
  JURISDICTION: rules.checkJurisdictionEnabled,
  RETAILER_LICENSE: rules.checkRetailerLicense,
  PRODUCT_ELIGIBILITY: rules.checkProductEligibility,
  DRY_DAY: rules.checkDryDay,
  OPERATING_HOURS: rules.checkOperatingHours,
  DELIVERY_LOCATION: rules.checkDeliveryLocation,
  ORDER_LIMITS: rules.checkOrderLimits,
}

const CHECK_PRIORITY: ComplianceCheckType[] = [
  'JURISDICTION',
  'RETAILER_LICENSE',
  'PRODUCT_ELIGIBILITY',
  'AGE_VERIFICATION',
  'DRY_DAY',
  'OPERATING_HOURS',
  'DELIVERY_LOCATION',
  'ORDER_LIMITS',
]

async function logComplianceAttempt(
  context: ComplianceContext,
  checks: ComplianceCheckType[],
  results: ComplianceCheckResult[],
  passed: boolean
): Promise<void> {
  try {
    const auditLog = await prisma.auditLog.create({
      data: {
        actorId: context.customerId || null,
        actorRole: 'SYSTEM',
        action: 'COMPLIANCE_CHECK',
        entityType: 'ORDER',
        entityId: '00000000-0000-0000-0000-000000000000',
        metadata: {
          checks,
          passed,
          results: results.map((r) => ({
            code: r.code,
            passed: r.passed,
            message: r.message,
          })),
          jurisdiction: context.jurisdiction,
          retailerId: context.retailerId,
          customerId: context.customerId,
        },
      },
    })

    return auditLog.id
  } catch {
    // Audit log failure should not block compliance checks
  }
}

export async function runComplianceCheck(
  context: ComplianceContext,
  checks: ComplianceCheckType[]
): Promise<{ passed: boolean; results: ComplianceCheckResult[] }> {
  const results: ComplianceCheckResult[] = []
  let allPassed = true

  const sortedChecks = [...checks].sort((a, b) => {
    const indexA = CHECK_PRIORITY.indexOf(a)
    const indexB = CHECK_PRIORITY.indexOf(b)
    return (indexA === -1 ? 99 : indexA) - (indexB === -1 ? 99 : indexB)
  })

  for (const checkType of sortedChecks) {
    const ruleFn = RULE_MAP[checkType]
    if (!ruleFn) {
      results.push({
        passed: false,
        code: `UNKNOWN_CHECK_${checkType}`,
        message: `Unknown compliance check type: ${checkType}`,
      })
      allPassed = false
      continue
    }

    try {
      const result = await ruleFn(context)
      results.push(result)

      if (!result.passed) {
        allPassed = false
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      results.push({
        passed: false,
        code: `CHECK_ERROR_${checkType}`,
        message: `Compliance check failed: ${errorMessage}`,
        details: { error: errorMessage },
      })
      allPassed = false
    }
  }

  await logComplianceAttempt(context, checks, results, allPassed)

  return { passed: allPassed, results }
}

export async function validateCheckoutCompliance(
  customerId: string,
  retailerId: string,
  deliveryAddressId: string
): Promise<{ passed: boolean; blockedReason?: string }> {
  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    include: { customerProfile: true },
  })

  if (!customer || customer.status !== 'ACTIVE') {
    return {
      passed: false,
      blockedReason: 'Customer account is not active',
    }
  }

  const retailer = await prisma.retailer.findUnique({
    where: { id: retailerId },
    include: {
      licences: true,
      products: {
        include: { inventory: true },
      },
    },
  })

  if (!retailer) {
    return {
      passed: false,
      blockedReason: 'Retailer not found',
    }
  }

  const address = await prisma.address.findUnique({
    where: { id: deliveryAddressId },
  })

  if (!address || address.userId !== customerId) {
    return {
      passed: false,
      blockedReason: 'Invalid delivery address',
    }
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: customerId },
    include: {
      items: {
        where: { retailerId },
        include: { product: true },
      },
    },
  })

  if (!cart || cart.items.length === 0) {
    return {
      passed: false,
      blockedReason: 'Cart is empty for this retailer',
    }
  }

  const subtotal = cart.items.reduce(
    (sum, item) => sum + Number(item.unitPrice) * item.quantity,
    0
  )

  const jurisdiction = await prisma.jurisdiction.findFirst({
    where: {
      country: address.country,
      state: address.state,
    },
  })

  const context: ComplianceContext = {
    customerId,
    retailerId,
    jurisdiction: jurisdiction?.code || address.country,
    deliveryLatitude: address.latitude,
    deliveryLongitude: address.longitude,
    orderTime: new Date(),
    orderAmount: subtotal,
    deliveryAddress: {
      state: address.state,
      city: address.city,
      country: address.country,
    },
  }

  const checks: ComplianceCheckType[] = [
    'JURISDICTION',
    'RETAILER_LICENSE',
    'DRY_DAY',
    'OPERATING_HOURS',
    'AGE_VERIFICATION',
    'DELIVERY_LOCATION',
    'ORDER_LIMITS',
  ]

  const { passed, results } = await runComplianceCheck(context, checks)

  if (!passed) {
    const firstFailure = results.find((r) => !r.passed)
    return {
      passed: false,
      blockedReason: firstFailure?.message || 'Compliance check failed',
    }
  }

  for (const item of cart.items) {
    const productResult = await rules.checkProductEligibility({
      ...context,
      productId: item.productId,
    })

    if (!productResult.passed) {
      return {
        passed: false,
        blockedReason: `Product "${item.product.name}": ${productResult.message}`,
      }
    }
  }

  return { passed: true }
}

export async function validateRetailerForOrders(
  retailerId: string
): Promise<ComplianceCheckResult> {
  const context: ComplianceContext = { retailerId }
  return rules.checkRetailerLicense(context)
}

export async function validateProductForOrder(
  productId: string,
  retailerId: string
): Promise<ComplianceCheckResult> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    return {
      passed: false,
      code: 'PRODUCT_NOT_FOUND',
      message: 'Product not found',
    }
  }

  if (product.retailerId !== retailerId) {
    return {
      passed: false,
      code: 'PRODUCT_WRONG_RETAILER',
      message: 'Product does not belong to this retailer',
    }
  }

  const inventory = await prisma.inventory.findUnique({
    where: { productId },
  })

  if (!inventory || inventory.stockQuantity <= inventory.reservedQuantity) {
    return {
      passed: false,
      code: 'PRODUCT_OUT_OF_STOCK',
      message: 'Product is out of stock',
    }
  }

  const context: ComplianceContext = {
    productId,
    retailerId,
  }

  return rules.checkProductEligibility(context)
}

export async function validateDeliveryTime(
  jurisdiction: string
): Promise<ComplianceCheckResult> {
  const context: ComplianceContext = { jurisdiction }

  const dryDayResult = await rules.checkDryDay(context)
  if (!dryDayResult.passed) {
    return dryDayResult
  }

  return rules.checkOperatingHours(context)
}

export async function isDryDay(
  jurisdiction: string,
  date?: Date
): Promise<boolean> {
  const jurisdictionRecord = await prisma.jurisdiction.findFirst({
    where: { code: jurisdiction },
  })

  if (!jurisdictionRecord) {
    return false
  }

  const checkDate = date ? new Date(date) : new Date()
  checkDate.setHours(0, 0, 0, 0)

  const dryDay = await prisma.dryDay.findFirst({
    where: {
      jurisdictionId: jurisdictionRecord.id,
      date: checkDate,
      status: 'ACTIVE',
    },
  })

  return dryDay !== null
}

export async function getJurisdictionRules(
  jurisdiction: string
): Promise<Record<string, unknown>> {
  const jurisdictionRecord = await prisma.jurisdiction.findFirst({
    where: { code: jurisdiction },
  })

  if (!jurisdictionRecord) {
    return {}
  }

  const rules = await prisma.complianceRule.findMany({
    where: {
      jurisdictionId: jurisdictionRecord.id,
      status: 'ACTIVE',
      effectiveFrom: { lte: new Date() },
      OR: [
        { effectiveUntil: null },
        { effectiveUntil: { gte: new Date() } },
      ],
    },
  })

  const rulesMap: Record<string, unknown> = {
    jurisdiction: {
      id: jurisdictionRecord.id,
      name: jurisdictionRecord.name,
      code: jurisdictionRecord.code,
      isAlcoholDeliveryEnabled: jurisdictionRecord.isAlcoholDeliveryEnabled,
      minimumAge: jurisdictionRecord.minimumAge,
      timezone: jurisdictionRecord.timezone,
    },
  }

  for (const rule of rules) {
    rulesMap[rule.ruleType] = rule.ruleValue
  }

  return rulesMap
}
