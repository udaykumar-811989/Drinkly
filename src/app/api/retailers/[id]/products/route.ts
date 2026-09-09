import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { productCreateSchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'
import { ValidationError, AuthorizationError, NotFoundError } from '@/lib/errors'

async function verifyRetailerStaff(retailerId: string, userId: string, role: string) {
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

    await verifyRetailerStaff(id, authUser.userId, authUser.role)

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = { retailerId: id, deletedAt: null }

    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true } },
          inventory: {
            select: { stockQuantity: true, reservedQuantity: true, status: true },
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuth(request)
    const { id } = await params

    await verifyRetailerStaff(id, authUser.userId, authUser.role)

    const data = await validateBody(request, productCreateSchema)

    if (data.retailerId !== id) {
      throw new ValidationError('retailerId must match the URL retailer')
    }

    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    })

    if (!category || !category.isActive) {
      throw new NotFoundError('Category not found or inactive')
    }

    const existingSku = await prisma.product.findFirst({
      where: { retailerId: id, sku: data.sku, deletedAt: null },
    })

    if (existingSku) {
      throw new ValidationError('SKU already exists for this retailer')
    }

    const product = await prisma.product.create({
      data: {
        retailerId: id,
        categoryId: data.categoryId,
        name: data.name,
        brand: data.brand,
        description: data.description,
        bottleSizeMl: data.bottleSizeMl,
        alcoholPercentage: data.alcoholPercentage,
        mrp: data.mrp,
        sellingPrice: data.sellingPrice,
        sku: data.sku,
        barcode: data.barcode,
        imageUrl: data.imageUrl,
        isAgeRestricted: data.isAgeRestricted,
        inventory: {
          create: {
            retailerId: id,
            stockQuantity: 0,
            status: 'OUT_OF_STOCK',
          },
        },
      },
      include: {
        category: { select: { id: true, name: true } },
        inventory: true,
      },
    })

    return successResponse(product, 'Product created successfully', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
