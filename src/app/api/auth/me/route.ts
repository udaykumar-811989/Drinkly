import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        customerProfile: true,
        ownedRetailers: {
          select: { id: true, displayName: true, status: true, logoUrl: true },
        },
        deliveryAgent: {
          select: { id: true, status: true, isAvailable: true, rating: true },
        },
      },
    })

    if (!user) {
      return errorResponse(new Error('User not found'), 404)
    }

    const { passwordHash: _, ...userWithoutPassword } = user

    return successResponse(userWithoutPassword)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
