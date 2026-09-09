export class TwilioSMSProvider {
  private accountSid: string
  private authToken: string
  private fromNumber: string

  constructor(accountSid: string, authToken: string, fromNumber: string) {
    this.accountSid = accountSid
    this.authToken = authToken
    this.fromNumber = fromNumber
  }

  async send(phone: string, message: string): Promise<boolean> {
    try {
      const credentials = Buffer.from(`${this.accountSid}:${this.authToken}`).toString(
        'base64',
      )

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: phone,
            From: this.fromNumber,
            Body: message,
          }),
        },
      )

      return response.ok
    } catch {
      return false
    }
  }
}
