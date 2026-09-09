import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'
import { NotFoundError } from '@/lib/errors'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: {
        retailer: {
          select: {
            id: true,
            displayName: true,
            logoUrl: true,
            addressCity: true,
            addressState: true,
            rating: true,
            estimatedDeliveryTimeMinutes: true,
          },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        inventory: {
          select: { stockQuantity: true, reservedQuantity: true, status: true },
        },
        reviews: {
          select: { rating: true, comment: true, createdAt: true, user: { select: { name: true } } },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: { select: { reviews: true } },
      },
    })

    if (!product) {
      throw new NotFoundError('Product not found')
    }

    if (product.status !== 'ACTIVE') {
      throw new NotFoundError('Product not available')
    }

    if (product.retailer.status !== 'ACTIVE') {
      throw new NotFoundError('Product retailer is not active')
    }

    return successResponse(product)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
