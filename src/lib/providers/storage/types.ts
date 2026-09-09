export interface StorageProvider {
  upload(file: Buffer, key: string, contentType: string): Promise<string>
  getSignedUrl(key: string, expiresIn?: number): Promise<string>
  delete(key: string): Promise<boolean>
  getTemporaryUploadUrl(key: string, contentType: string): Promise<{ uploadUrl: string; key: string }>
}
