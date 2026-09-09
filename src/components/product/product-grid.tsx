import * as React from 'react'
import { cn } from '@/lib/utils'
import { ProductCard } from './product-card'
import { Skeleton } from '@/components/ui/skeleton'

interface Product {
  id: string
  name: string
  brand: string
  price: number
  mrp?: number
  image?: string
  inStock?: boolean
  ageRestricted?: boolean
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  onAddToCart?: (id: string) => void
  onQuickView?: (id: string) => void
  className?: string
}

function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card overflow-hidden">
          <Skeleton className="aspect-[4/5] rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-end justify-between pt-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductGrid({
  products,
  loading = false,
  onAddToCart,
  onQuickView,
  className,
}: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton />
  }

  if (products.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
        <div className="rounded-full bg-muted p-6 mb-4">
          <svg className="h-12 w-12 text-muted-foreground/40" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground">No products found</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6',
        className
      )}
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          {...product}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
        />
      ))}
    </div>
  )
}

export { ProductGrid, ProductGridSkeleton }
