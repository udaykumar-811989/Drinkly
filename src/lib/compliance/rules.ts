import { prisma } from '../prisma'
import { calculateAge } from '../utils'
import { ComplianceContext, ComplianceCheckResult } from './types'

export async function checkAgeVerification(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  if (!context.customerId) {
    return {
      passed: false,
      code: 'AGE_NO_CUSTOMER',
      message: 'Customer ID is required for age verification',
    }
  }

  const profile = await prisma.customerProfile.findUnique({
    where: { userId: context.customerId },
  })

  if (!profile) {
    return {
      passed: false,
      code: 'AGE_NO_PROFILE',
      message: 'Customer profile not found',
    }
  }

  if (profile.ageVerified !== 'VERIFIED') {
    return {
      passed: false,
      code: 'AGE_NOT_VERIFIED',
      message: 'Customer age has not been verified',
      details: { status: profile.ageVerified },
    }
  }

  const age = calculateAge(profile.dateOfBirth)
  const jurisdiction = context.jurisdiction || 'IN'

  const jurisdictionRecord = await prisma.jurisdiction.findFirst({
    where: { code: jurisdiction },
  })

  const minimumAge = jurisdictionRecord?.minimumAge || 21

  if (age < minimumAge) {
    return {
      passed: false,
      code: 'AGE_UNDER_MINIMUM',
      message: `Customer age ${age} is below minimum requirement of ${minimumAge}`,
      details: { age, minimumAge },
    }
  }

  return {
    passed: true,
    code: 'AGE_VERIFIED',
    message: 'Customer meets minimum age requirement',
    details: { age, minimumAge },
  }
}

export async function checkJurisdictionEnabled(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  const jurisdictionCode = context.jurisdiction
  if (!jurisdictionCode) {
    return {
      passed: false,
      code: 'JURISDICTION_NOT_SPECIFIED',
      message: 'Jurisdiction is required',
    }
  }

  const jurisdiction = await prisma.jurisdiction.findFirst({
    where: { code: jurisdictionCode },
  })

  if (!jurisdiction) {
    return {
      passed: false,
      code: 'JURISDICTION_NOT_FOUND',
      message: `Jurisdiction "${jurisdictionCode}" does not exist`,
    }
  }

  if (!jurisdiction.isAlcoholDeliveryEnabled) {
    return {
      passed: false,
      code: 'JURISDICTION_DELIVERY_DISABLED',
      message: `Alcohol delivery is not enabled in ${jurisdiction.name}`,
    }
  }

  return {
    passed: true,
    code: 'JURISDICTION_ENABLED',
    message: `Alcohol delivery is enabled in ${jurisdiction.name}`,
    details: { jurisdictionId: jurisdiction.id, name: jurisdiction.name },
  }
}

export async function checkRetailerLicense(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  if (!context.retailerId) {
    return {
      passed: false,
      code: 'RETAILER_NO_ID',
      message: 'Retailer ID is required',
    }
  }

  const retailer = await prisma.retailer.findUnique({
    where: { id: context.retailerId },
    include: { licences: true },
  })

  if (!retailer) {
    return {
      passed: false,
      code: 'RETAILER_NOT_FOUND',
      message: 'Retailer not found',
    }
  }

  if (retailer.status !== 'ACTIVE') {
    return {
      passed: false,
      code: 'RETAILER_INACTIVE',
      message: `Retailer status is ${retailer.status}, expected ACTIVE`,
      details: { status: retailer.status },
    }
  }

  const activeLicence = retailer.licences.find(
    (l) => l.verificationStatus === 'VERIFIED'
  )

  if (!activeLicence) {
    return {
      passed: false,
      code: 'RETAILER_NO_LICENCE',
      message: 'Retailer has no verified licence on file',
    }
  }

  if (activeLicence.expiryDate < new Date()) {
    return {
      passed: false,
      code: 'RETAILER_LICENCE_EXPIRED',
      message: 'Retailer licence has expired',
      details: { expiryDate: activeLicence.expiryDate.toISOString() },
    }
  }

  return {
    passed: true,
    code: 'RETAILER_LICENSED',
    message: 'Retailer has a valid, active licence',
    details: {
      licenceNumber: activeLicence.licenceNumber,
      expiryDate: activeLicence.expiryDate.toISOString(),
    },
  }
}

export async function checkProductEligibility(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  if (!context.productId) {
    return {
      passed: false,
      code: 'PRODUCT_NO_ID',
      message: 'Product ID is required',
    }
  }

  const product = await prisma.product.findUnique({
    where: { id: context.productId },
    include: { category: true },
  })

  if (!product) {
    return {
      passed: false,
      code: 'PRODUCT_NOT_FOUND',
      message: 'Product not found',
    }
  }

  if (product.status === 'PROHIBITED') {
    return {
      passed: false,
      code: 'PRODUCT_PROHIBITED',
      message: 'This product is prohibited for sale',
      details: { status: product.status },
    }
  }

  if (product.status !== 'ACTIVE') {
    return {
      passed: false,
      code: 'PRODUCT_INACTIVE',
      message: `Product status is ${product.status}, expected ACTIVE`,
      details: { status: product.status },
    }
  }

  if (context.retailerId && product.retailerId !== context.retailerId) {
    return {
      passed: false,
      code: 'PRODUCT_WRONG_RETAILER',
      message: 'Product does not belong to this retailer',
    }
  }

  const inventory = await prisma.inventory.findUnique({
    where: { productId: context.productId },
  })

  if (!inventory || inventory.stockQuantity <= inventory.reservedQuantity) {
    return {
      passed: false,
      code: 'PRODUCT_OUT_OF_STOCK',
      message: 'Product is out of stock',
      details: {
        stockQuantity: inventory?.stockQuantity ?? 0,
        reservedQuantity: inventory?.reservedQuantity ?? 0,
      },
    }
  }

  if (context.jurisdiction) {
    const jurisdiction = await prisma.jurisdiction.findFirst({
      where: { code: context.jurisdiction },
    })

    if (jurisdiction) {
      const categoryRule = await prisma.complianceRule.findFirst({
        where: {
          jurisdictionId: jurisdiction.id,
          ruleType: 'ALLOWED_PRODUCT_CATEGORY',
          status: 'ACTIVE',
          effectiveFrom: { lte: new Date() },
          OR: [
            { effectiveUntil: null },
            { effectiveUntil: { gte: new Date() } },
          ],
        },
      })

      if (categoryRule) {
        const allowedCategories = categoryRule.ruleValue as string[]
        if (
          Array.isArray(allowedCategories) &&
          !allowedCategories.includes(product.category.name)
        ) {
          return {
            passed: false,
            code: 'PRODUCT_CATEGORY_RESTRICTED',
            message: `Product category "${product.category.name}" is restricted in this jurisdiction`,
            details: { allowedCategories },
          }
        }
      }
    }
  }

  return {
    passed: true,
    code: 'PRODUCT_ELIGIBLE',
    message: 'Product is eligible for sale',
    details: { name: product.name, category: product.category.name },
  }
}

export async function checkDryDay(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  const jurisdictionCode = context.jurisdiction
  if (!jurisdictionCode) {
    return {
      passed: false,
      code: 'DRY_DAY_NO_JURISDICTION',
      message: 'Jurisdiction is required to check dry day status',
    }
  }

  const jurisdiction = await prisma.jurisdiction.findFirst({
    where: { code: jurisdictionCode },
  })

  if (!jurisdiction) {
    return {
      passed: false,
      code: 'DRY_DAY_JURISDICTION_NOT_FOUND',
      message: `Jurisdiction "${jurisdictionCode}" not found`,
    }
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dryDay = await prisma.dryDay.findFirst({
    where: {
      jurisdictionId: jurisdiction.id,
      date: today,
      status: 'ACTIVE',
    },
  })

  if (dryDay) {
    return {
      passed: false,
      code: 'DRY_DAY_ACTIVE',
      message: `Today is a dry day in ${jurisdiction.name}. Alcohol delivery is prohibited`,
      details: {
        date: dryDay.date.toISOString(),
        reason: dryDay.reason,
      },
    }
  }

  return {
    passed: true,
    code: 'DRY_DAY_CLEAR',
    message: 'Today is not a dry day',
  }
}

export async function checkOperatingHours(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  const jurisdictionCode = context.jurisdiction
  if (!jurisdictionCode) {
    return {
      passed: false,
      code: 'HOURS_NO_JURISDICTION',
      message: 'Jurisdiction is required to check operating hours',
    }
  }

  const jurisdiction = await prisma.jurisdiction.findFirst({
    where: { code: jurisdictionCode },
  })

  if (!jurisdiction) {
    return {
      passed: false,
      code: 'HOURS_JURISDICTION_NOT_FOUND',
      message: `Jurisdiction "${jurisdictionCode}" not found`,
    }
  }

  const now = new Date()
  const dayOfWeek = now.getDay()

  let retailerHours = null
  if (context.retailerId) {
    retailerHours = await prisma.operatingHours.findUnique({
      where: {
        retailerId_dayOfWeek: {
          retailerId: context.retailerId,
          dayOfWeek,
        },
      },
    })
  }

  const jurisdictionHours = await prisma.operatingHours.findUnique({
    where: {
      jurisdictionId_dayOfWeek: {
        jurisdictionId: jurisdiction.id,
        dayOfWeek,
      },
    },
  })

  const hours = retailerHours || jurisdictionHours

  if (!hours) {
    return {
      passed: false,
      code: 'HOURS_NO_SCHEDULE',
      message: 'No operating hours configured for this jurisdiction or retailer',
    }
  }

  if (hours.isClosed) {
    return {
      passed: false,
      code: 'HOURS_CLOSED_TODAY',
      message: 'Delivery is closed today',
      details: { dayOfWeek },
    }
  }

  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  if (currentTime < hours.openTime || currentTime > hours.closeTime) {
    return {
      passed: false,
      code: 'HOURS_OUTSIDE_RANGE',
      message: `Current time ${currentTime} is outside permitted delivery hours (${hours.openTime} - ${hours.closeTime})`,
      details: {
        currentTime,
        openTime: hours.openTime,
        closeTime: hours.closeTime,
      },
    }
  }

  return {
    passed: true,
    code: 'HOURS_WITHIN_RANGE',
    message: 'Current time is within permitted delivery hours',
    details: {
      currentTime,
      openTime: hours.openTime,
      closeTime: hours.closeTime,
    },
  }
}

export async function checkDeliveryLocation(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  if (!context.retailerId) {
    return {
      passed: false,
      code: 'LOCATION_NO_RETAILER',
      message: 'Retailer ID is required for delivery location check',
    }
  }

  if (!context.deliveryLatitude || !context.deliveryLongitude) {
    return {
      passed: false,
      code: 'LOCATION_NO_COORDINATES',
      message: 'Delivery coordinates are required',
    }
  }

  const retailer = await prisma.retailer.findUnique({
    where: { id: context.retailerId },
    select: {
      latitude: true,
      longitude: true,
      operatingRadiusKm: true,
    },
  })

  if (!retailer) {
    return {
      passed: false,
      code: 'LOCATION_RETAILER_NOT_FOUND',
      message: 'Retailer not found',
    }
  }

  const R = 6371
  const dLat = ((context.deliveryLatitude - retailer.latitude) * Math.PI) / 180
  const dLon =
    ((context.deliveryLongitude - retailer.longitude) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((retailer.latitude * Math.PI) / 180) *
      Math.cos((context.deliveryLatitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  const radius = Number(retailer.operatingRadiusKm)

  if (distance > radius) {
    return {
      passed: false,
      code: 'LOCATION_OUTSIDE_RADIUS',
      message: `Delivery location is ${distance.toFixed(1)}km away, exceeds maximum radius of ${radius}km`,
      details: {
        distance: Math.round(distance * 100) / 100,
        maxRadius: radius,
      },
    }
  }

  if (context.jurisdiction) {
    const jurisdiction = await prisma.jurisdiction.findFirst({
      where: { code: context.jurisdiction },
    })

    if (jurisdiction) {
      const restriction = await prisma.complianceRule.findFirst({
        where: {
          jurisdictionId: jurisdiction.id,
          ruleType: 'RESTRICTED_LOCATION',
          status: 'ACTIVE',
          effectiveFrom: { lte: new Date() },
          OR: [
            { effectiveUntil: null },
            { effectiveUntil: { gte: new Date() } },
          ],
        },
      })

      if (restriction) {
        const restrictedZones = restriction.ruleValue as Array<{
          lat: number
          lng: number
          radius: number
        }>

        for (const zone of restrictedZones) {
          const distLat =
            ((context.deliveryLatitude - zone.lat) * Math.PI) / 180
          const distLon =
            ((context.deliveryLongitude - zone.lng) * Math.PI) / 180
          const zoneA =
            Math.sin(distLat / 2) * Math.sin(distLat / 2) +
            Math.cos((zone.lat * Math.PI) / 180) *
              Math.cos((context.deliveryLatitude * Math.PI) / 180) *
              Math.sin(distLon / 2) *
              Math.sin(distLon / 2)
          const zoneC = 2 * Math.atan2(Math.sqrt(zoneA), Math.sqrt(1 - zoneA))
          const zoneDistance = R * zoneC

          if (zoneDistance <= zone.radius) {
            return {
              passed: false,
              code: 'LOCATION_RESTRICTED_ZONE',
              message: 'Delivery address is within a restricted zone',
              details: {
                distance: Math.round(zoneDistance * 100) / 100,
                zoneRadius: zone.radius,
              },
            }
          }
        }
      }
    }
  }

  return {
    passed: true,
    code: 'LOCATION_DELIVERABLE',
    message: 'Delivery location is within permitted area',
    details: {
      distance: Math.round(distance * 100) / 100,
      maxRadius: radius,
    },
  }
}

export async function checkOrderLimits(
  context: ComplianceContext
): Promise<ComplianceCheckResult> {
  if (context.orderAmount === undefined) {
    return {
      passed: false,
      code: 'ORDER_NO_AMOUNT',
      message: 'Order amount is required for limit check',
    }
  }

  if (context.jurisdiction) {
    const jurisdiction = await prisma.jurisdiction.findFirst({
      where: { code: context.jurisdiction },
    })

    if (jurisdiction) {
      const maxLimit = await prisma.complianceRule.findFirst({
        where: {
          jurisdictionId: jurisdiction.id,
          ruleType: 'MAX_ORDER_LIMIT',
          status: 'ACTIVE',
          effectiveFrom: { lte: new Date() },
          OR: [
            { effectiveUntil: null },
            { effectiveUntil: { gte: new Date() } },
          ],
        },
      })

      if (maxLimit) {
        const maxAmount = (maxLimit.ruleValue as { maxAmount: number })
          .maxAmount
        if (context.orderAmount > maxAmount) {
          return {
            passed: false,
            code: 'ORDER_ABOVE_JURISDICTION_MAX',
            message: `Order amount ${context.orderAmount} exceeds jurisdiction maximum of ${maxAmount}`,
            details: {
              orderAmount: context.orderAmount,
              maxAmount,
            },
          }
        }
      }
    }
  }

  if (context.retailerId) {
    const retailer = await prisma.retailer.findUnique({
      where: { id: context.retailerId },
      select: { minimumOrderAmount: true },
    })

    if (retailer) {
      const minAmount = Number(retailer.minimumOrderAmount)
      if (context.orderAmount < minAmount) {
        return {
          passed: false,
          code: 'ORDER_BELOW_RETAILER_MIN',
          message: `Order amount ${context.orderAmount} is below retailer minimum of ${minAmount}`,
          details: {
            orderAmount: context.orderAmount,
            minimumOrder: minAmount,
          },
        }
      }
    }
  }

  return {
    passed: true,
    code: 'ORDER_LIMITS_OK',
    message: 'Order meets all amount requirements',
    details: { orderAmount: context.orderAmount },
  }
}
