import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { validateBody } from '@/lib/validators-middleware'
import { checkoutSchema } from '@/lib/validators'
import { successResponse, errorResponse } from '@/lib/api-response'
import { validateCheckoutCompliance } from '@/lib/compliance/engine'
import { ComplianceError, ValidationError } from '@/lib/errors'
import { PLATFORM_FEE_PERCENTAGE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const data = await validateBody(request, checkoutSchema)

    const cart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, sellingPrice: true, status: true, isAgeRestricted: true },
            },
            retailer: {
              select: { id: true, displayName: true, minimumOrderAmount: true },
            },
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      throw new ValidationError('Cart is empty')
    }

    const retailerIds = [...new Set(cart.items.map((item) => item.retailerId))]
    if (retailerIds.length > 1) {
      throw new ValidationError('Cart contains items from multiple retailers. Please checkout one retailer at a time.')
    }

    const retailerId = retailerIds[0]
    const retailer = cart.items[0].retailer

    for (const item of cart.items) {
      if (item.product.status !== 'ACTIVE') {
        throw new ValidationError(`Product "${item.product.name}" is no longer available`)
      }

      const inventory = await prisma.inventory.findUnique({
        where: { productId: item.productId },
      })

      if (!inventory || inventory.stockQuantity - inventory.reservedQuantity < item.quantity) {
        throw new ValidationError(`Insufficient stock for "${item.product.name}"`)
      }
    }

    const address = await prisma.address.findUnique({
      where: { id: data.deliveryAddressId },
    })

    if (!address || address.userId !== authUser.userId) {
      throw new ValidationError('Invalid delivery address')
    }

    const complianceResult = await validateCheckoutCompliance(
      authUser.userId,
      retailerId,
      data.deliveryAddressId
    )

    if (!complianceResult.passed) {
      throw new ComplianceError(complianceResult.blockedReason || 'Compliance check failed')
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 5.99
    const platformFee = (subtotal * PLATFORM_FEE_PERCENTAGE) / 100
    const taxAmount = subtotal * 0.18
    const totalAmount = subtotal + deliveryFee + platformFee + taxAmount

    return successResponse({
      valid: true,
      retailerId,
      retailerName: retailer.displayName,
      items: cart.items.map((item) => ({
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.unitPrice) * item.quantity,
      })),
      deliveryAddress: {
        id: address.id,
        line1: address.line1,
        line2: address.line2,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      },
      pricing: {
        subtotal,
        deliveryFee,
        platformFee,
        taxAmount,
        totalAmount,
      },
      compliance: complianceResult,
    })
  } catch (error) {
    return errorResponse(error as Error)
  }
}
