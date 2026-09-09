export interface VerificationProvider {
  verifyAge(data: AgeVerificationInput): Promise<VerificationResult>
  verifyIdentity(data: IdentityVerificationInput): Promise<VerificationResult>
}

export interface AgeVerificationInput {
  dateOfBirth: Date
  fullName?: string
  documentUrl?: string
}

export interface IdentityVerificationInput {
  documentType: string
  documentUrl: string
  selfieUrl?: string
}

export interface VerificationResult {
  verified: boolean
  status: 'VERIFIED' | 'FAILED' | 'REVIEW_REQUIRED'
  confidence?: number
  reason?: string
  referenceId?: string
}
