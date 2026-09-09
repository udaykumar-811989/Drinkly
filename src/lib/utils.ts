import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function generateOrderNumber(): string {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(10000 + Math.random() * 90000).toString()
  return `DRK-${date}-${random}`
}

export function formatCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function calculateAge(dateOfBirth: Date): number {
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }

  return age
}

export interface Address {
  line1: string
  line2?: string | null
  city: string
  state: string
  zipCode: string
  country: string
  latitude?: number | null
  longitude?: number | null
}

export function formatAddress(address: Address): string {
  const parts = [address.line1]
  if (address.line2) parts.push(address.line2)
  parts.push(`${address.city}, ${address.state} ${address.zipCode}`)
  parts.push(address.country)
  return parts.join(', ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function paginate(
  page: number,
  limit: number
): { skip: number; take: number } {
  const safePage = Math.max(1, Math.floor(page))
  const safeLimit = Math.min(100, Math.max(1, Math.floor(limit)))
  return {
    skip: (safePage - 1) * safeLimit,
    take: safeLimit,
  }
}

export function generateId(): string {
  return uuidv4()
}
