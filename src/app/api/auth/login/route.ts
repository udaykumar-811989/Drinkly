import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'
import { loginSchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { AuthenticationError, NotFoundError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const data = await validateBody(request, loginSchema)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new AuthenticationError('Invalid email or password')
    }

    if (user.status === 'SUSPENDED' || user.status === 'BLOCKED') {
      throw new AuthenticationError('Account is not active')
    }

    const isValid = await comparePassword(data.password, user.passwordHash)
    if (!isValid) {
      throw new AuthenticationError('Invalid email or password')
    }

    const token = generateToken(user.id, user.role)

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })

    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null
    const userAgent = request.headers.get('user-agent') || null

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        ipAddress,
        userAgent,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    const { passwordHash: _, ...userWithoutPassword } = user

    return successResponse({ user: userWithoutPassword, token }, 'Login successful')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
