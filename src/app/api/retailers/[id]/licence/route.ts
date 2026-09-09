import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, AuthorizationError, NotFoundError } from '@/lib/errors'

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

  if (retailer.ownerId === userId) {
    return true
  }

  if (role === 'RETAILER_STAFF') {
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

    const licences = await prisma.retailerLicence.findMany({
      where: { retailerId: id },
      select: {
        id: true,
        licenceNumber: true,
        licenceType: true,
        issuingAuthority: true,
        issueDate: true,
        expiryDate: true,
        verificationStatus: true,
        verificationNotes: true,
        verifiedAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return successResponse(licences)
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

    await verifyRetailerAccess(id, authUser.userId, authUser.role)

    const body = await request.json()
    const { licenceNumber, licenceType, issuingAuthority, issueDate, expiryDate, documentUrl } = body

    if (!licenceNumber || !licenceType || !issuingAuthority || !issueDate || !expiryDate || !documentUrl) {
      throw new ValidationError('All licence fields are required')
    }

    const existingLicence = await prisma.retailerLicence.findFirst({
      where: { retailerId: id, licenceNumber },
    })

    if (existingLicence) {
      throw new ValidationError('Licence number already exists for this retailer')
    }

    const licence = await prisma.retailerLicence.create({
      data: {
        retailerId: id,
        licenceNumber,
        licenceType,
        issuingAuthority,
        issueDate: new Date(issueDate),
        expiryDate: new Date(expiryDate),
        documentUrl,
        verificationStatus: 'PENDING',
      },
    })

    return successResponse(licence, 'Licence uploaded successfully', 201)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
