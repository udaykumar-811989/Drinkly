import type { NotificationProvider, NotificationTemplate } from './types'
import { TwilioSMSProvider } from './sms'
import { ResendEmailProvider, SendGridEmailProvider } from './email'
import { FirebasePushProvider } from './push'

class CompositeNotificationProvider implements NotificationProvider {
  private smsProvider: TwilioSMSProvider
  private emailProvider: ResendEmailProvider | SendGridEmailProvider
  private pushProvider: FirebasePushProvider
  private templates: Map<string, NotificationTemplate> = new Map()

  constructor(
    smsProvider: TwilioSMSProvider,
    emailProvider: ResendEmailProvider | SendGridEmailProvider,
    pushProvider: FirebasePushProvider,
    templates: NotificationTemplate[] = [],
  ) {
    this.smsProvider = smsProvider
    this.emailProvider = emailProvider
    this.pushProvider = pushProvider
    for (const template of templates) {
      this.templates.set(template.id, template)
    }
  }

  async sendSMS(phone: string, message: string): Promise<boolean> {
    return this.smsProvider.send(phone, message)
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    return this.emailProvider.send(to, subject, html)
  }

  async sendPush(
    token: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<boolean> {
    return this.pushProvider.send(token, title, body, data)
  }

  async sendWhatsApp(phone: string, message: string): Promise<boolean> {
    const twilioSid = process.env.TWILIO_ACCOUNT_SID
    const twilioToken = process.env.TWILIO_AUTH_TOKEN
    const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER

    if (!twilioSid || !twilioToken || !whatsappNumber) {
      return false
    }

    try {
      const credentials = Buffer.from(`${twilioSid}:${twilioToken}`).toString('base64')
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: `whatsapp:${phone}`,
            From: `whatsapp:${whatsappNumber}`,
            Body: message,
          }),
        },
      )

      return response.ok
    } catch {
      return false
    }
  }

  getTemplate(id: string): NotificationTemplate | undefined {
    return this.templates.get(id)
  }

  renderTemplate(
    templateId: string,
    variables: Record<string, string>,
  ): { subject?: string; body: string } {
    const template = this.templates.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    let body = template.body
    for (const variable of template.variables) {
      const value = variables[variable]
      if (value === undefined) {
        throw new Error(`Missing variable: ${variable}`)
      }
      body = body.replace(new RegExp(`{{${variable}}}`, 'g'), value)
    }

    let subject = template.subject
    if (subject) {
      for (const variable of template.variables) {
        const value = variables[variable]
        if (value !== undefined) {
          subject = subject.replace(new RegExp(`{{${variable}}}`, 'g'), value)
        }
      }
    }

    return { subject, body }
  }

  addTemplate(template: NotificationTemplate): void {
    this.templates.set(template.id, template)
  }
}

let providerInstance: CompositeNotificationProvider | null = null

export function getNotificationProvider(): CompositeNotificationProvider {
  if (providerInstance) {
    return providerInstance
  }

  const twilioSid = process.env.TWILIO_ACCOUNT_SID
  const twilioToken = process.env.TWILIO_AUTH_TOKEN
  const fromNumber = process.env.TWILIO_PHONE_NUMBER

  if (!twilioSid || !twilioToken || !fromNumber) {
    throw new Error('Twilio credentials must be configured')
  }

  const smsProvider = new TwilioSMSProvider(twilioSid, twilioToken, fromNumber)

  const emailProviderType = process.env.EMAIL_PROVIDER ?? 'resend'
  let emailProvider: ResendEmailProvider | SendGridEmailProvider

  const fromAddress = process.env.EMAIL_FROM ?? 'noreply@drinkly.com'

  if (emailProviderType === 'sendgrid') {
    const apiKey = process.env.SENDGRID_API_KEY
    if (!apiKey) throw new Error('SendGrid API key must be configured')
    emailProvider = new SendGridEmailProvider(apiKey, fromAddress)
  } else {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) throw new Error('Resend API key must be configured')
    emailProvider = new ResendEmailProvider(apiKey, fromAddress)
  }

  const firebaseKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  const projectId = process.env.FIREBASE_PROJECT_ID
  if (!firebaseKey || !projectId) {
    throw new Error('Firebase credentials must be configured')
  }
  const pushProvider = new FirebasePushProvider(firebaseKey, projectId)

  providerInstance = new CompositeNotificationProvider(smsProvider, emailProvider, pushProvider)
  return providerInstance
}

export function resetNotificationProvider(): void {
  providerInstance = null
}

export type { NotificationProvider, NotificationTemplate } from './types'
