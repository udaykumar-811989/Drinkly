import crypto from 'crypto'
import type { StorageProvider } from './types'

const ALLOWED_CONTENT_TYPES: Record<string, string[]> = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
  'application/pdf': ['.pdf'],
}

export class S3StorageProvider implements StorageProvider {
  private accessKeyId: string
  private secretAccessKey: string
  private region: string
  private bucket: string
  private baseUrl: string

  constructor(
    accessKeyId: string,
    secretAccessKey: string,
    region: string,
    bucket: string,
  ) {
    this.accessKeyId = accessKeyId
    this.secretAccessKey = secretAccessKey
    this.region = region
    this.bucket = bucket
    this.baseUrl = `https://${bucket}.s3.${region}.amazonaws.com`
  }

  async upload(file: Buffer, key: string, contentType: string): Promise<string> {
    this.validateFileType(contentType)

    const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = date.slice(0, 8)
    const credential = `${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request`

    const headers: Record<string, string> = {
      'host': `${this.bucket}.s3.${this.region}.amazonaws.com`,
      'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
      'x-amz-date': date,
      'x-amz-server-side-encryption': 'AES256',
      'content-type': contentType,
    }

    const canonicalHeaders = Object.keys(headers)
      .sort()
      .map((k) => `${k}:${headers[k]}`)
      .join('\n')

    const signedHeaders = Object.keys(headers).sort().join('\n')

    const canonicalRequest = [
      'PUT',
      `/${key}`,
      '',
      canonicalHeaders,
      signedHeaders,
      'UNSIGNED-PAYLOAD',
    ].join('\n')

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      date,
      `${dateStamp}/${this.region}/s3/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
    ].join('\n')

    const signingKey = this.getSignatureKey(dateStamp)
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')

    const authorizationHeader = [
      `AWS4-HMAC-SHA256 Credential=${credential}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(', ')

    const response = await fetch(`${this.baseUrl}/${key}`, {
      method: 'PUT',
      headers: {
        Authorization: authorizationHeader,
        'x-amz-date': date,
        'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
        'x-amz-server-side-encryption': 'AES256',
        'content-type': contentType,
      },
      body: file,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`S3 upload failed: ${text}`)
    }

    return `${this.baseUrl}/${key}`
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = date.slice(0, 8)
    const expiryEpoch = Math.floor(Date.now() / 1000) + expiresIn

    const credential = `${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request`

    const canonicalRequest = [
      'GET',
      `/${key}`,
      '',
      `host:${this.bucket}.s3.${this.region}.amazonaws.com\n`,
      'host',
      'UNSIGNED-PAYLOAD',
    ].join('\n')

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      date,
      `${dateStamp}/${this.region}/s3/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
    ].join('\n')

    const signingKey = this.getSignatureKey(dateStamp)
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')

    const params = new URLSearchParams({
      'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
      'X-Amz-Credential': credential,
      'X-Amz-Date': date,
      'X-Amz-Expires': expiresIn.toString(),
      'X-Amz-SignedHeaders': 'host',
      'X-Amz-Signature': signature,
    })

    return `${this.baseUrl}/${key}?${params}`
  }

  async delete(key: string): Promise<boolean> {
    const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = date.slice(0, 8)
    const credential = `${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request`

    const canonicalRequest = [
      'DELETE',
      `/${key}`,
      '',
      `host:${this.bucket}.s3.${this.region}.amazonaws.com\n`,
      'host',
      'UNSIGNED-PAYLOAD',
    ].join('\n')

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      date,
      `${dateStamp}/${this.region}/s3/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
    ].join('\n')

    const signingKey = this.getSignatureKey(dateStamp)
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')

    const response = await fetch(`${this.baseUrl}/${key}`, {
      method: 'DELETE',
      headers: {
        Authorization: [
          `AWS4-HMAC-SHA256 Credential=${credential}`,
          'SignedHeaders=host',
          `Signature=${signature}`,
        ].join(', '),
        'x-amz-date': date,
        'x-amz-content-sha256': 'UNSIGNED-PAYLOAD',
      },
    })

    return response.ok || response.status === 204
  }

  async getTemporaryUploadUrl(
    key: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; key: string }> {
    this.validateFileType(contentType)

    const date = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = date.slice(0, 8)
    const expiresIn = 300
    const expiryEpoch = Math.floor(Date.now() / 1000) + expiresIn
    const credential = `${this.accessKeyId}/${dateStamp}/${this.region}/s3/aws4_request`

    const canonicalQueryString = [
      `X-Amz-Algorithm=AWS4-HMAC-SHA256`,
      `X-Amz-Credential=${encodeURIComponent(credential)}`,
      `X-Amz-Date=${date}`,
      `X-Amz-Expires=${expiresIn}`,
      `X-Amz-SignedHeaders=content-type%3Bhost`,
    ].sort().join('&')

    const canonicalRequest = [
      'PUT',
      `/${key}`,
      canonicalQueryString,
      `content-type:${contentType}\nhost:${this.bucket}.s3.${this.region}.amazonaws.com\n`,
      'content-type;host',
      'UNSIGNED-PAYLOAD',
    ].join('\n')

    const stringToSign = [
      'AWS4-HMAC-SHA256',
      date,
      `${dateStamp}/${this.region}/s3/aws4_request`,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex'),
    ].join('\n')

    const signingKey = this.getSignatureKey(dateStamp)
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')

    const uploadUrl = `${this.baseUrl}/${key}?${canonicalQueryString}&X-Amz-Signature=${signature}`

    return { uploadUrl, key }
  }

  private validateFileType(contentType: string): void {
    if (!ALLOWED_CONTENT_TYPES[contentType]) {
      const allowed = Object.values(ALLOWED_CONTENT_TYPES).flat().join(', ')
      throw new Error(
        `Content type ${contentType} is not allowed. Allowed types: ${allowed}`,
      )
    }
  }

  private getSignatureKey(dateStamp: string): Buffer {
    const kDate = crypto
      .createHmac('sha256', `AWS4${this.secretAccessKey}`)
      .update(dateStamp)
      .digest()
    const kRegion = crypto.createHmac('sha256', kDate).update(this.region).digest()
    const kService = crypto.createHmac('sha256', kRegion).update('s3').digest()
    const kSigning = crypto
      .createHmac('sha256', kService)
      .update('aws4_request')
      .digest()
    return kSigning
  }
}
