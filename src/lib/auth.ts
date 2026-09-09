import { compare, hash } from 'bcryptjs'
import crypto from 'crypto'
import { NextRequest } from 'next/server'
import prisma from './prisma'
import { AuthenticationError, AuthorizationError } from './errors'

const SALT_ROUNDS = 12
const TOKEN_EXPIRY_HOURS = 24
const SECRET_KEY = process.env.JWT_SECRET || 'drinkly-secret-key-change-in-production'

interface TokenPayload {
  userId: string
  role: string
  iat: number
  exp: number
}

interface AuthUser {
  userId: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export function generateToken(userId: string, role: string): string {
  const now = Math.floor(Date.now() / 1000)
  const payload: TokenPayload = {
    userId,
    role,
    iat: now,
    exp: now + TOKEN_EXPIRY_HOURS * 3600,
  }

  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url')

  const signature = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(`${header}.${body}`)
    .digest('base64url')

  return `${header}.${body}.${signature}`
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, body, signature] = parts

    const expectedSignature = crypto
      .createHmac('sha256', SECRET_KEY)
      .update(`${header}.${body}`)
      .digest('base64url')

    if (signature !== expectedSignature) return null

    const payload: TokenPayload = JSON.parse(Buffer.from(body, 'base64url').toString())

    if (Date.now() / 1000 > payload.exp) return null

    return {
      userId: payload.userId,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser> {
  const authHeader = request.headers.get('Authorization')
  let token: string | null = null

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7)
  }

  if (!token) {
    token = request.cookies.get('token')?.value ?? null
  }

  if (!token) {
    throw new AuthenticationError('No authentication token provided')
  }

  const user = verifyToken(token)
  if (!user) {
    throw new AuthenticationError('Invalid or expired token')
  }

  return user
}

export async function requireAuth(request: NextRequest): Promise<AuthUser> {
  return getCurrentUser(request)
}

export async function requireRole(request: NextRequest, roles: string[]): Promise<AuthUser> {
  const user = await getCurrentUser(request)

  if (!roles.includes(user.role)) {
    throw new AuthorizationError(
      `Access denied. Required roles: ${roles.join(', ')}`
    )
  }

  return user
}
