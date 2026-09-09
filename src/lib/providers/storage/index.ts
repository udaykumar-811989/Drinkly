import type { StorageProvider } from './types'
import { S3StorageProvider } from './s3'

let providerInstance: StorageProvider | null = null

export function getStorageProvider(): StorageProvider {
  if (providerInstance) {
    return providerInstance
  }

  const providerType = process.env.STORAGE_PROVIDER ?? 's3'

  switch (providerType) {
    case 's3': {
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
      const region = process.env.AWS_REGION ?? 'us-east-1'
      const bucket = process.env.S3_BUCKET_NAME

      if (!accessKeyId || !secretAccessKey || !bucket) {
        throw new Error('S3 credentials and bucket name must be configured')
      }

      providerInstance = new S3StorageProvider(accessKeyId, secretAccessKey, region, bucket)
      break
    }
    default:
      throw new Error(`Unknown storage provider: ${providerType}`)
  }

  return providerInstance
}

export function resetStorageProvider(): void {
  providerInstance = null
}

export type { StorageProvider } from './types'
