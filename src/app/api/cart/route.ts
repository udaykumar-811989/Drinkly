import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { cartItemSchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, NotFoundError } from '@/lib/errors'

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    const cart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                brand: true,
                imageUrl: true,
                sellingPrice: true,
                bottleSizeMl: true,
                alcoholPercentage: true,
                status: true,
              },
            },
            retailer: {
              select: { id: true, displayName: true, logoUrl: true },
            },
          },
        },
      },
    })

    if (!cart) {
      return successResponse({ items: [], totalAmount: 0, itemCount: 0 })
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    return successResponse({
      id: cart.id,
      items: cart.items,
      totalAmount,
      itemCount,
      updatedAt: cart.updatedAt,
    })
  } catch (error) {
    return errorResponse(error as Error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const data = await validateBody(request, cartItemSchema)

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { inventory: true },
    })

    if (!product || product.status !== 'ACTIVE') {
      throw new NotFoundError('Product not found or unavailable')
    }

    if (product.retailerId !== data.retailerId) {
      throw new ValidationError('Product does not belong to the specified retailer')
    }

    if (!product.inventory || product.inventory.stockQuantity <= product.inventory.reservedQuantity) {
      throw new ValidationError('Product is out of stock')
    }

    const retailer = await prisma.retailer.findUnique({
      where: { id: data.retailerId },
      select: { status: true, minimumOrderAmount: true },
    })

    if (!retailer || retailer.status !== 'ACTIVE') {
      throw new NotFoundError('Retailer not available')
    }

    let cart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
      include: { items: true },
    })

    if (cart && cart.items.length > 0) {
      const existingRetailerId = cart.items[0].retailerId
      if (existingRetailerId !== data.retailerId) {
        throw new ValidationError(
          'Cart already contains items from a different retailer. Please clear the cart first.'
        )
      }
    }

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: authUser.userId },
        include: { items: true },
      })
    }

    const existingItem = cart.items.find((item) => item.productId === data.productId)

    if (existingItem) {
      const newQuantity = existingItem.quantity + data.quantity
      if (newQuantity > 99) {
        throw new ValidationError('Maximum quantity per item is 99')
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      })
    } else {
      if (data.quantity > 99) {
        throw new ValidationError('Maximum quantity per item is 99')
      }

      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: data.productId,
          retailerId: data.retailerId,
          quantity: data.quantity,
          unitPrice: product.sellingPrice,
        },
      })
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, brand: true, imageUrl: true, sellingPrice: true },
            },
            retailer: {
              select: { id: true, displayName: true },
            },
          },
        },
      },
    })

    const totalAmount = updatedCart!.items.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    )

    return successResponse(
      { ...updatedCart, totalAmount },
      'Item added to cart',
      201
    )
  } catch (error) {
    return errorResponse(error as Error)
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const body = await request.json()

    const { itemId, quantity } = body as { itemId: string; quantity: number }

    if (!itemId || typeof quantity !== 'number' || quantity < 1 || quantity > 99) {
      throw new ValidationError('Invalid itemId or quantity (1-99)')
    }

    const cart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
    })

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id: itemId, cartId: cart.id },
    })

    if (!cartItem) {
      throw new NotFoundError('Cart item not found')
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    })

    return successResponse(null, 'Cart updated')
  } catch (error) {
    return errorResponse(error as Error)
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    const cart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
    })

    if (!cart) {
      return successResponse(null, 'Cart already empty')
    }

    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    return successResponse(null, 'Cart cleared')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
