export interface NotificationProvider {
  sendSMS(phone: string, message: string): Promise<boolean>
  sendEmail(to: string, subject: string, html: string): Promise<boolean>
  sendPush(
    token: string,
    title: string,
    body: string,
    data?: Record<string, unknown>,
  ): Promise<boolean>
  sendWhatsApp(phone: string, message: string): Promise<boolean>
}

export interface NotificationTemplate {
  id: string
  type: 'SMS' | 'EMAIL' | 'PUSH' | 'WHATSAPP'
  subject?: string
  body: string
  variables: string[]
}
