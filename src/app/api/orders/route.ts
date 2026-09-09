import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth, requireRole } from '@/lib/auth'
import { validateBody } from '@/lib/validators-middleware'
import { checkoutSchema } from '@/lib/validators'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate, generateOrderNumber } from '@/lib/utils'
import { validateCheckoutCompliance } from '@/lib/compliance/engine'
import { ComplianceError, ValidationError, NotFoundError } from '@/lib/errors'
import { PLATFORM_FEE_PERCENTAGE, FREE_DELIVERY_THRESHOLD } from '@/lib/constants'

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = {}

    if (authUser.role === 'CUSTOMER') {
      where.customerId = authUser.userId
    } else if (authUser.role === 'RETAILER_OWNER' || authUser.role === 'RETAILER_STAFF') {
      const retailer = await prisma.retailer.findFirst({
        where: {
          OR: [
            { ownerId: authUser.userId },
            { staff: { some: { userId: authUser.userId } } },
          ],
        },
      })
      if (retailer) {
        where.retailerId = retailer.id
      }
    }

    if (status) where.status = status

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, brand: true, imageUrl: true },
              },
            },
          },
          retailer: {
            select: { id: true, displayName: true, logoUrl: true },
          },
          delivery: {
            select: { id: true, status: true, estimatedMinutes: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ])

    return paginatedResponse(orders, total, page, limit)
  } catch (error) {
    return errorResponse(error as Error)
  }
}

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
              select: { id: true, name: true, sellingPrice: true, status: true },
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
      throw new ValidationError('Cart contains items from multiple retailers')
    }

    const retailerId = retailerIds[0]

    const complianceResult = await validateCheckoutCompliance(
      authUser.userId,
      retailerId,
      data.deliveryAddressId
    )

    if (!complianceResult.passed) {
      throw new ComplianceError(complianceResult.blockedReason || 'Compliance check failed')
    }

    const address = await prisma.address.findUnique({
      where: { id: data.deliveryAddressId },
    })

    if (!address || address.userId !== authUser.userId) {
      throw new ValidationError('Invalid delivery address')
    }

    for (const item of cart.items) {
      const inventory = await prisma.inventory.findUnique({
        where: { productId: item.productId },
      })

      if (!inventory || inventory.stockQuantity - inventory.reservedQuantity < item.quantity) {
        throw new ValidationError(`Insufficient stock for "${item.product.name}"`)
      }
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )

    const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : 5.99
    const platformFee = (subtotal * PLATFORM_FEE_PERCENTAGE) / 100
    const taxAmount = subtotal * 0.18
    const totalAmount = subtotal + deliveryFee + platformFee + taxAmount

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cart.items) {
        await tx.inventory.update({
          where: { productId: item.productId },
          data: {
            reservedQuantity: { increment: item.quantity },
          },
        })
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          customerId: authUser.userId,
          retailerId,
          deliveryAddressId: data.deliveryAddressId,
          status: 'PAYMENT_PENDING',
          subtotal,
          taxAmount,
          deliveryFee,
          platformFee,
          totalAmount,
          notes: data.notes,
          specialInstructions: data.specialInstructions,
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: Number(item.unitPrice) * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                select: { id: true, name: true, brand: true, imageUrl: true },
              },
            },
          },
          retailer: {
            select: { id: true, displayName: true },
          },
        },
      })

      return newOrder
    })

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return successResponse(order, 'Order created successfully', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
