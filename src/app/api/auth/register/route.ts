import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword, generateToken } from '@/lib/auth'
import { registerSchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ConflictError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const data = await validateBody(request, registerSchema)

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          ...(data.phone ? [{ phone: data.phone }] : []),
        ],
      },
    })

    if (existingUser) {
      throw new ConflictError(
        existingUser.email === data.email
          ? 'Email already registered'
          : 'Phone number already registered'
      )
    }

    const passwordHash = await hashPassword(data.password)

    const user = await prisma.user.create({
      data: {
        email: data.email,
        phone: data.phone || null,
        passwordHash,
        name: data.name,
        role: 'CUSTOMER',
        status: 'PENDING_VERIFICATION',
        customerProfile: {
          create: {
            dateOfBirth: data.dateOfBirth,
            ageVerified: 'PENDING',
            addressLine1: '',
            addressCity: '',
            addressState: '',
            addressZipCode: '',
          },
        },
      },
      include: { customerProfile: true },
    })

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    await prisma.oTP.create({
      data: {
        userId: user.id,
        phone: data.phone || null,
        email: data.email,
        code: otpCode,
        type: data.phone ? 'PHONE_VERIFICATION' : 'EMAIL_VERIFICATION',
        expiresAt,
      },
    })

    const token = generateToken(user.id, user.role)

    const { passwordHash: _, ...userWithoutPassword } = user

    return successResponse(
      { user: userWithoutPassword, token },
      'Registration successful. Please verify your account.',
      201
    )
  } catch (error) {
    return errorResponse(error as Error)
  }
}
