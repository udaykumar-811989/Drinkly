export class ResendEmailProvider {
  private apiKey: string
  private fromAddress: string
  private baseUrl = 'https://api.resend.com'

  constructor(apiKey: string, fromAddress: string) {
    this.apiKey = apiKey
    this.fromAddress = fromAddress
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: this.fromAddress,
          to: [to],
          subject,
          html,
        }),
      })

      return response.ok
    } catch {
      return false
    }
  }
}

export class SendGridEmailProvider {
  private apiKey: string
  private fromAddress: string

  constructor(apiKey: string, fromAddress: string) {
    this.apiKey = apiKey
    this.fromAddress = fromAddress
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: this.fromAddress },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      })

      return response.ok
    } catch {
      return false
    }
  }
}
