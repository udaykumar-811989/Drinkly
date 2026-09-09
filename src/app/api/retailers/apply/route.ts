import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { retailerApplySchema } from '@/lib/validators'
import { validateBody } from '@/lib/validators-middleware'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ConflictError } from '@/lib/errors'

export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuth(request)
    const data = await validateBody(request, retailerApplySchema)

    const existingRetailer = await prisma.retailer.findFirst({
      where: {
        ownerId: authUser.userId,
        deletedAt: null,
      },
    })

    if (existingRetailer) {
      throw new ConflictError('You already have a retailer application')
    }

    const retailer = await prisma.retailer.create({
      data: {
        ownerId: authUser.userId,
        legalBusinessName: data.legalBusinessName,
        displayName: data.displayName,
        description: data.description,
        phone: data.phone,
        email: data.email,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressCity: data.addressCity,
        addressState: data.addressState,
        addressZipCode: data.addressZipCode,
        addressCountry: data.addressCountry,
        latitude: data.latitude,
        longitude: data.longitude,
        minimumOrderAmount: data.minimumOrderAmount,
        estimatedDeliveryTimeMinutes: data.estimatedDeliveryTimeMinutes,
        operatingRadiusKm: data.operatingRadiusKm,
        status: 'PENDING',
        licences: {
          create: {
            licenceNumber: data.licenceNumber,
            licenceType: data.licenceType,
            issuingAuthority: data.issuingAuthority,
            issueDate: data.licenceIssueDate,
            expiryDate: data.licenceExpiryDate,
            documentUrl: data.licenceDocumentUrl,
            verificationStatus: 'PENDING',
          },
        },
      },
      include: {
        licences: true,
      },
    })

    await prisma.user.update({
      where: { id: authUser.userId },
      data: { role: 'RETAILER_OWNER' },
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: 'RETAILER_APPLICATION',
        entityType: 'RETAILER',
        entityId: retailer.id,
        metadata: {
          businessName: data.legalBusinessName,
          displayName: data.displayName,
        },
      },
    })

    return successResponse(retailer, 'Retailer application submitted', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
