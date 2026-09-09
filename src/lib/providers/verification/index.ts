import type {
  VerificationProvider,
  AgeVerificationInput,
  IdentityVerificationInput,
  VerificationResult,
} from './types'

class LocalAgeVerificationProvider implements VerificationProvider {
  private minimumAge: number

  constructor(minimumAge: number = 21) {
    this.minimumAge = minimumAge
  }

  async verifyAge(data: AgeVerificationInput): Promise<VerificationResult> {
    const today = new Date()
    const birthDate = new Date(data.dateOfBirth)

    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    if (age >= this.minimumAge) {
      return {
        verified: true,
        status: 'VERIFIED',
        confidence: 1.0,
        referenceId: crypto.randomUUID(),
      }
    }

    return {
      verified: false,
      status: 'FAILED',
      confidence: 1.0,
      reason: `Age ${age} does not meet minimum requirement of ${this.minimumAge}`,
    }
  }

  async verifyIdentity(
    data: IdentityVerificationInput,
  ): Promise<VerificationResult> {
    if (!data.documentUrl) {
      return {
        verified: false,
        status: 'FAILED',
        confidence: 1.0,
        reason: 'No document provided',
      }
    }

    const validDocumentTypes = ['drivers_license', 'passport', 'national_id']
    if (!validDocumentTypes.includes(data.documentType)) {
      return {
        verified: false,
        status: 'FAILED',
        confidence: 1.0,
        reason: `Invalid document type: ${data.documentType}`,
      }
    }

    return {
      verified: false,
      status: 'REVIEW_REQUIRED',
      confidence: 0,
      referenceId: crypto.randomUUID(),
      reason: 'Manual review required for identity verification',
    }
  }
}

let providerInstance: VerificationProvider | null = null

export function getVerificationProvider(): VerificationProvider {
  if (providerInstance) {
    return providerInstance
  }

  const providerType = process.env.VERIFICATION_PROVIDER ?? 'local'

  switch (providerType) {
    case 'local': {
      const minimumAge = parseInt(process.env.MINIMUM_AGE ?? '21', 10)
      providerInstance = new LocalAgeVerificationProvider(minimumAge)
      break
    }
    default:
      throw new Error(`Unknown verification provider: ${providerType}`)
  }

  return providerInstance
}

export function resetVerificationProvider(): void {
  providerInstance = null
}

export type {
  VerificationProvider,
  AgeVerificationInput,
  IdentityVerificationInput,
  VerificationResult,
} from './types'
