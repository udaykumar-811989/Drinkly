import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPhoneSchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const data = await validateBody(request, verifyPhoneSchema)

    const otp = await prisma.oTP.findFirst({
      where: {
        phone: data.phone,
        code: data.code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    })

    if (!otp) {
      throw new ValidationError('Invalid or expired verification code')
    }

    await prisma.oTP.update({
      where: { id: otp.id },
      data: { usedAt: new Date() },
    })

    if (otp.userId) {
      const user = await prisma.user.findUnique({
        where: { id: otp.userId },
        include: { customerProfile: true },
      })

      if (user) {
        const updateData: Record<string, unknown> = { phoneVerified: true }

        if (user.status === 'PENDING_VERIFICATION' && user.emailVerified) {
          updateData.status = 'ACTIVE'
        }

        await prisma.user.update({
          where: { id: user.id },
          data: updateData,
        })

        if (user.customerProfile && user.customerProfile.ageVerified === 'PENDING') {
          const age = Math.floor(
            (Date.now() - new Date(user.customerProfile.dateOfBirth).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          )

          if (age >= 21) {
            await prisma.customerProfile.update({
              where: { userId: user.id },
              data: { ageVerified: 'VERIFIED' },
            })
          }
        }
      }
    }

    return successResponse(null, 'Phone verified successfully')
  } catch (error) {
    return errorResponse(error as Error)
  }
}
