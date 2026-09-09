import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const city = searchParams.get('city')
    const state = searchParams.get('state')
    const search = searchParams.get('search')
    const isOpen = searchParams.get('isOpen')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
      deletedAt: null,
    }

    if (city) where.addressCity = city
    if (state) where.addressState = state

    if (search) {
      where.OR = [
        { displayName: { contains: search, mode: 'insensitive' } },
        { legalBusinessName: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (isOpen === 'true') {
      const now = new Date()
      const dayOfWeek = now.getDay()
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      where.operatingHours = {
        some: {
          dayOfWeek,
          isClosed: false,
          openTime: { lte: currentTime },
          closeTime: { gte: currentTime },
        },
      }
    }

    const [stores, total] = await Promise.all([
      prisma.retailer.findMany({
        where,
        include: {
          licences: {
            where: { verificationStatus: 'VERIFIED' },
            select: { id: true, licenceNumber: true, licenceType: true },
          },
          _count: { select: { products: { where: { status: 'ACTIVE' } } } },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.retailer.count({ where }),
    ])

    return paginatedResponse(stores, total, page, limit)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
