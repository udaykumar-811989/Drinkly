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

    const store = await prisma.retailer.findUnique({
      where: { id, deletedAt: null },
      include: {
        licences: {
          where: { verificationStatus: 'VERIFIED' },
          select: { id: true, licenceNumber: true, licenceType: true, expiryDate: true },
        },
        operatingHours: true,
        _count: {
          select: {
            products: { where: { status: 'ACTIVE' } },
            reviews: true,
          },
        },
        reviews: {
          select: { rating: true, comment: true, createdAt: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    })

    if (!store) {
      throw new NotFoundError('Store not found')
    }

    if (store.status !== 'ACTIVE') {
      throw new NotFoundError('Store not available')
    }

    return successResponse(store)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
