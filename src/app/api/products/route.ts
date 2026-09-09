import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const retailerId = searchParams.get('retailer')
    const search = searchParams.get('search')
    const available = searchParams.get('available')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = {
      status: 'ACTIVE',
      deletedAt: null,
      retailer: { status: 'ACTIVE', deletedAt: null },
    }

    if (category) where.categoryId = category
    if (brand) where.brand = { contains: brand, mode: 'insensitive' }
    if (retailerId) where.retailerId = retailerId

    if (minPrice || maxPrice) {
      where.sellingPrice = {}
      if (minPrice) (where.sellingPrice as Record<string, number>).gte = parseFloat(minPrice)
      if (maxPrice) (where.sellingPrice as Record<string, number>).lte = parseFloat(maxPrice)
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (available === 'true') {
      where.inventory = {
        stockQuantity: { gt: 0 },
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          retailer: {
            select: { id: true, displayName: true, logoUrl: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          inventory: {
            select: { stockQuantity: true, status: true },
          },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ])

    return paginatedResponse(products, total, page, limit)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
