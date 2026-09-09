import { NextResponse } from 'next/server'
import { AppError } from './errors'

interface SuccessResponse<T = unknown> {
  success: true
  data: T
  message?: string
}

interface ErrorResponse {
  success: false
  error: {
    message: string
    code: string
    statusCode: number
    errors?: Record<string, string[]>
  }
}

interface PaginatedMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
}

interface PaginatedResponse<T = unknown> {
  success: true
  data: T[]
  meta: PaginatedMeta
}

export function successResponse<T>(
  data: T,
  message?: string,
  statusCode: number = 200
): NextResponse<SuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      ...(message && { message }),
    },
    { status: statusCode }
  )
}

export function errorResponse(
  error: AppError | Error,
  statusCode?: number
): NextResponse<ErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false as const,
        error: {
          message: error.message,
          code: error.code,
          statusCode: error.statusCode,
          ...(error instanceof AppError && 'errors' in error && { errors: (error as any).errors }),
        },
      },
      { status: statusCode ?? error.statusCode }
    )
  }

  return NextResponse.json(
    {
      success: false as const,
      error: {
        message: error.message || 'Internal server error',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    },
    { status: statusCode ?? 500 }
  )
}

export function paginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): NextResponse<PaginatedResponse<T>> {
  const totalPages = Math.ceil(total / limit)

  return NextResponse.json(
    {
      success: true as const,
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    },
    { status: 200 }
  )
}
