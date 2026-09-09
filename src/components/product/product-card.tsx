'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProductCardProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  name: string
  brand: string
  price: number
  mrp?: number
  image?: string
  inStock?: boolean
  ageRestricted?: boolean
  onAddToCart?: (id: string) => void
  onQuickView?: (id: string) => void
}

function ProductCard({
  id,
  name,
  brand,
  price,
  mrp,
  image,
  inStock = true,
  ageRestricted = false,
  onAddToCart,
  onQuickView,
  className,
  ...props
}: ProductCardProps) {
  const hasDiscount = mrp !== undefined && mrp > price
  const discountPercent = hasDiscount ? Math.round(((mrp! - price) / mrp!) * 100) : 0

  return (
    <div
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1',
        !inStock && 'opacity-75',
        className
      )}
      {...props}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v13.5A1.5 1.5 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasDiscount && (
            <Badge variant="destructive" size="sm">
              -{discountPercent}%
            </Badge>
          )}
          {ageRestricted && (
            <Badge variant="warning" size="sm">
              21+
            </Badge>
          )}
        </div>

        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <p className="text-sm font-semibold text-foreground">Out of Stock</p>
          </div>
        )}

        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full shadow-md"
            onClick={(e) => {
              e.stopPropagation()
              onQuickView?.(id)
            }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">{brand}</p>
        <h3 className="mt-1 text-sm font-semibold text-foreground line-clamp-2 leading-snug">
          {name}
        </h3>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">${price.toFixed(2)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                ${mrp!.toFixed(2)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => onAddToCart?.(id)}
            disabled={!inStock}
            className="rounded-lg"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}

export { ProductCard }
