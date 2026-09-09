import * as React from 'react'
import { cn } from '@/lib/utils'
import { Badge, type BadgeProps } from '@/components/ui/badge'

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

interface OrderStatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status: OrderStatus
}

const statusConfig: Record<OrderStatus, { label: string; variant: BadgeProps['variant'] }> = {
  pending: { label: 'Pending', variant: 'warning' },
  confirmed: { label: 'Confirmed', variant: 'default' },
  processing: { label: 'Processing', variant: 'default' },
  shipped: { label: 'Shipped', variant: 'default' },
  delivered: { label: 'Delivered', variant: 'success' },
  cancelled: { label: 'Cancelled', variant: 'destructive' },
}

function OrderStatusBadge({ status, className, ...props }: OrderStatusBadgeProps) {
  const { label, variant } = statusConfig[status]

  return (
    <Badge variant={variant} className={cn('font-medium', className)} {...props}>
      {label}
    </Badge>
  )
}

export { OrderStatusBadge }
