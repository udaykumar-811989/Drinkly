import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'
import { requireRole } from '@/lib/auth'
import { successResponse, errorResponse } from '@/lib/api-response'
import { ValidationError, NotFoundError } from '@/lib/errors'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireRole(request, ['ADMIN', 'SUPER_ADMIN', 'COMPLIANCE_OFFICER'])
    const { id } = await params

    const body = await request.json()
    const { action, notes } = body as { action: 'approve' | 'reject'; notes?: string }

    if (!action || !['approve', 'reject'].includes(action)) {
      throw new ValidationError('Action must be "approve" or "reject"')
    }

    const retailer = await prisma.retailer.findUnique({
      where: { id, deletedAt: null },
      include: { licences: true },
    })

    if (!retailer) {
      throw new NotFoundError('Retailer not found')
    }

    if (retailer.status !== 'PENDING' && retailer.status !== 'DOCUMENT_REVIEW') {
      throw new ValidationError(`Retailer status is ${retailer.status}, cannot process`)
    }

    const newStatus = action === 'approve' ? 'ACTIVE' : 'REJECTED'

    const updatedRetailer = await prisma.$transaction(async (tx) => {
      const updated = await tx.retailer.update({
        where: { id },
        data: { status: newStatus },
      })

      if (action === 'approve') {
        for (const licence of retailer.licences) {
          await tx.retailerLicence.update({
            where: { id: licence.id },
            data: {
              verificationStatus: 'VERIFIED',
              verifiedBy: authUser.userId,
              verifiedAt: new Date(),
              verificationNotes: notes || 'Approved by admin',
            },
          })
        }
      } else {
        for (const licence of retailer.licences) {
          await tx.retailerLicence.update({
            where: { id: licence.id },
            data: {
              verificationStatus: 'FAILED',
              verifiedBy: authUser.userId,
              verifiedAt: new Date(),
              verificationNotes: notes || 'Rejected by admin',
            },
          })
        }
      }

      return updated
    })

    await prisma.auditLog.create({
      data: {
        actorId: authUser.userId,
        actorRole: authUser.role,
        action: action === 'approve' ? 'RETAILER_APPROVED' : 'RETAILER_REJECTED',
        entityType: 'RETAILER',
        entityId: id,
        metadata: {
          businessName: retailer.legalBusinessName,
          previousStatus: retailer.status,
          newStatus,
          notes,
        },
      },
    })

    return successResponse(updatedRetailer, `Retailer ${action === 'approve' ? 'approved' : 'rejected'}`)
  } catch (error) {
    return errorResponse(error as Error)
  }
}
