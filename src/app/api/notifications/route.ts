import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'
import { paginate } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type')
    const unreadOnly = searchParams.get('unreadOnly') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const { skip, take } = paginate(page, limit)

    const where: Record<string, unknown> = { userId: authUser.userId }

    if (type) where.type = type
    if (unreadOnly) where.readAt = null

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId: authUser.userId, readAt: null },
      }),
    ])

    const response = paginatedResponse(notifications, total, page, limit)
    const json = await response.json()

    return Response.json({
      ...json,
      unreadCount,
    })
  } catch (error) {
    return errorResponse(error as Error)
  }
}
