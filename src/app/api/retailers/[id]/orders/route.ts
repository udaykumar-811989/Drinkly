import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'
import { AuthorizationError, NotFoundError } from '@/lib/errors'

async function verifyRetailerAccess(retailerId: string, userId: string, role: string) {
  if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
    return true
  }

  const retailer = await prisma.retailer.findUnique({
    where: { id: retailerId },
  })

  if (!retailer) {
    throw new NotFoundError('Retailer not found')
  }

  if (retailer.ownerId === userId) return true

  if (role === 'RETAILER_STAFF' || role === 'RETAILER_OWNER') {
    const staff = await prisma.retailerStaff.findFirst({
      where: { retailerId, userId },
    })
    if (staff) return true
  }

  throw new AuthorizationError('Not authorized for this retailer')
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = await params

    await verifyRetailerAccess(id, authUser.userId, authUser.role)

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = { retailerId: id, deletedAt: null }

    if (status) where.status = status

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) (where.createdAt as Record<string, Date>).gte = new Date(startDate)
      if (endDate) (where.createdAt as Record<string, Date>).lte = new Date(endDate)
    }

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
          customer: {
            select: { id: true, name: true, phone: true, email: true },
          },
          delivery: {
            select: { id: true, status: true },
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
