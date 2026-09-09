import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'

interface CartSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  subtotal: number
  tax: number
  deliveryFee: number
  platformFee?: number
  onCheckout?: () => void
  loading?: boolean
}

function CartSummary({
  subtotal,
  tax,
  deliveryFee,
  platformFee = 0,
  onCheckout,
  loading = false,
  className,
  ...props
}: CartSummaryProps) {
  const total = subtotal + tax + deliveryFee + platformFee

  return (
    <div
      className={cn(
        'rounded-xl border bg-card p-5 shadow-sm space-y-4',
        className
      )}
      {...props}
    >
      <h3 className="font-semibold text-foreground">Order Summary</h3>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tax</span>
          <span className="font-medium">{formatCurrency(tax)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Delivery Fee</span>
          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-emerald-600">Free</span>
            ) : (
              formatCurrency(deliveryFee)
            )}
          </span>
        </div>
        {platformFee > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee</span>
            <span className="font-medium">{formatCurrency(platformFee)}</span>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground">Total</span>
        <span className="text-lg font-bold text-foreground">{formatCurrency(total)}</span>
      </div>

      <Button
        className="w-full"
        size="lg"
        onClick={onCheckout}
        loading={loading}
      >
        Proceed to Checkout
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By proceeding, you agree to our Terms of Service and age verification.
      </p>
    </div>
  )
}

export { CartSummary }
