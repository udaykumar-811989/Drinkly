'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

interface CartItemProps extends React.HTMLAttributes<HTMLDivElement> {
  id: string
  name: string
  brand?: string
  image?: string
  price: number
  quantity: number
  maxQuantity?: number
  onUpdateQuantity?: (id: string, quantity: number) => void
  onRemove?: (id: string) => void
}

function CartItem({
  id,
  name,
  brand,
  image,
  price,
  quantity,
  maxQuantity = 99,
  onUpdateQuantity,
  onRemove,
  className,
  ...props
}: CartItemProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl border bg-card transition-colors hover:bg-accent/30',
        className
      )}
      {...props}
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v13.5A1.5 1.5 0 0 0 3.75 21Z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        {brand && (
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{brand}</p>
        )}
        <h3 className="text-sm font-medium text-foreground truncate">{name}</h3>
        <p className="text-sm font-semibold text-foreground mt-0.5">{formatCurrency(price)}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border bg-background">
          <button
            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            onClick={() => onUpdateQuantity?.(id, Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
            </svg>
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            onClick={() => onUpdateQuantity?.(id, Math.min(maxQuantity, quantity + 1))}
            disabled={quantity >= maxQuantity}
          >
            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
          onClick={() => onRemove?.(id)}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </Button>
      </div>
    </div>
  )
}

export { CartItem }
