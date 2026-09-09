import { NextRequest } from 'next/server'
import { ZodSchema, ZodError } from 'zod'
import { ValidationError } from './errors'

export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  let body: unknown

  try {
    const contentType = request.headers.get('content-type')

    if (contentType?.includes('application/json')) {
      body = await request.json()
    } else if (contentType?.includes('application/x-www-form-urlencoded')) {
      const text = await request.text()
      const params = new URLSearchParams(text)
      body = Object.fromEntries(params.entries())
    } else {
      body = await request.json()
    }
  } catch {
    throw new ValidationError('Invalid request body')
  }

  try {
    return schema.parse(body)
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const field = err.path.join('.')
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })
      throw new ValidationError('Validation failed', errors)
    }
    throw new ValidationError('Validation failed')
  }
}

export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  const searchParams = request.nextUrl.searchParams
  const query: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    query[key] = value
  })

  try {
    return schema.parse(query)
  } catch (error) {
    if (error instanceof ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const field = err.path.join('.')
        if (!errors[field]) {
          errors[field] = []
        }
        errors[field].push(err.message)
      })
      throw new ValidationError('Invalid query parameters', errors)
    }
    throw new ValidationError('Invalid query parameters')
  }
}
