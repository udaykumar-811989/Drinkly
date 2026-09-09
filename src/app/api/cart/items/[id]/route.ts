import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { NotFoundError } from '@/lib/errors'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = await params

    const cart = await prisma.cart.findUnique({
      where: { userId: authUser.userId },
    })

    if (!cart) {
      throw new NotFoundError('Cart not found')
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: { id, cartId: cart.id },
    })

    if (!cartItem) {
      throw new NotFoundError('Cart item not found')
    }

    await prisma.cartItem.delete({
      where: { id },
    })

    return successResponse(null, 'Item removed from cart')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
