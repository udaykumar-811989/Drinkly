'use client'

import * as React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderItem {
  name: string
  image?: string
  quantity: number
  price: number
}

interface OrderCardProps extends React.HTMLAttributes<HTMLDivElement> {
  orderId: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  date: string
  onReorder?: (orderId: string) => void
  onViewDetails?: (orderId: string) => void
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'success' | 'warning' | 'outline' }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  processing: { label: 'Processing', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

function OrderCard({
  orderId,
  status,
  items,
  total,
  date,
  onReorder,
  onViewDetails,
  className,
  ...props
}: OrderCardProps) {
  const { label, variant } = statusConfig[status]

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md',
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Order #{orderId}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{date}</p>
        </div>
        <Badge variant={variant}>{label}</Badge>
      </div>

      <div className="space-y-3 mb-4">
        {items.slice(0, 3).map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v13.5A1.5 1.5 0 0 0 3.75 21Z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="text-sm font-medium">{formatCurrency(item.price * item.quantity)}</p>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            +{items.length - 3} more item{items.length - 3 > 1 ? 's' : ''}
          </p>
        )}
      </div>

      <div className="border-t pt-3 flex items-center justify-between">
        <p className="text-sm font-semibold">
          Total: {formatCurrency(total)}
        </p>
        <div className="flex gap-2">
          {status === 'delivered' && onReorder && (
            <Button size="sm" variant="outline" onClick={() => onReorder(orderId)}>
              Reorder
            </Button>
          )}
          {onViewDetails && (
            <Button size="sm" variant="ghost" onClick={() => onViewDetails(orderId)}>
              Details
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export { OrderCard }
