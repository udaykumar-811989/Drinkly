export class FirebasePushProvider {
  private serviceAccountKey: string
  private projectId: string

  constructor(serviceAccountKey: string, projectId: string) {
    this.serviceAccountKey = serviceAccountKey
    this.projectId = projectId
  }

  async send(
    token: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<boolean> {
    try {
      const accessToken = await this.getAccessToken()

      const response = await fetch(
        `https://fcm.googleapis.com/v1/projects/${this.projectId}/messages:send`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: {
              token,
              notification: { title, body },
              data: data
                ? Object.fromEntries(
                    Object.entries(data).map(([k, v]) => [k, String(v)]),
                  )
                : undefined,
            },
          }),
        },
      )

      return response.ok
    } catch {
      return false
    }
  }

  private async getAccessToken(): Promise<string> {
    const keyData = JSON.parse(this.serviceAccountKey) as {
      client_email: string
      private_key: string
    }

    const now = Math.floor(Date.now() / 1000)
    const expiry = now + 3600

    const header = { alg: 'RS256', typ: 'JWT' }
    const payload = {
      iss: keyData.client_email,
      scope: 'https://www.googleapis.com/auth/firebase.messaging',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: expiry,
    }

    const encodedHeader = btoa(JSON.stringify(header))
    const encodedPayload = btoa(JSON.stringify(payload))
    const signatureInput = `${encodedHeader}.${encodedPayload}`

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'pkcs8',
      encoder.encode(keyData.private_key),
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      encoder.encode(signatureInput),
    )

    const encodedSignature = btoa(
      String.fromCharCode(...new Uint8Array(signature)),
    )
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    const jwt = `${signatureInput}.${encodedSignature}`

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt,
      }),
    })

    const tokenData = (await tokenResponse.json()) as { access_token: string }
    return tokenData.access_token
  }
}
