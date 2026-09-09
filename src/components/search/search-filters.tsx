'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Select, type SelectOption } from '@/components/ui/select'

interface FilterGroup {
  label: string
  options: SelectOption[]
}

interface PriceRange {
  min?: number
  max?: number
}

interface SearchFiltersProps extends React.HTMLAttributes<HTMLDivElement> {
  categories?: FilterGroup
  brands?: FilterGroup
  retailers?: FilterGroup
  bottleSizes?: FilterGroup
  priceRange?: PriceRange
  onPriceRangeChange?: (range: PriceRange) => void
  availabilityOnly?: boolean
  onAvailabilityChange?: (value: boolean) => void
  onApplyFilters?: (filters: Record<string, string>) => void
  onClearFilters?: () => void
}

function SearchFilters({
  categories,
  brands,
  retailers,
  bottleSizes,
  priceRange,
  onPriceRangeChange,
  availabilityOnly = false,
  onAvailabilityChange,
  onApplyFilters,
  onClearFilters,
  className,
  ...props
}: SearchFiltersProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('')
  const [selectedBrand, setSelectedBrand] = React.useState('')
  const [selectedRetailer, setSelectedRetailer] = React.useState('')
  const [selectedSize, setSelectedSize] = React.useState('')
  const [minPrice, setMinPrice] = React.useState(priceRange?.min?.toString() || '')
  const [maxPrice, setMaxPrice] = React.useState(priceRange?.max?.toString() || '')

  const handleApply = () => {
    onApplyFilters?.({
      category: selectedCategory,
      brand: selectedBrand,
      retailer: selectedRetailer,
      size: selectedSize,
      minPrice,
      maxPrice,
    })
  }

  const handleClear = () => {
    setSelectedCategory('')
    setSelectedBrand('')
    setSelectedRetailer('')
    setSelectedSize('')
    setMinPrice('')
    setMaxPrice('')
    onAvailabilityChange?.(false)
    onClearFilters?.()
  }

  return (
    <div
      className={cn('rounded-xl border bg-card p-5 space-y-6', className)}
      {...props}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Filters</h3>
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleClear}
        >
          Clear all
        </button>
      </div>

      <div className="space-y-4">
        {categories && (
          <Select
            label="Category"
            options={[{ value: '', label: 'All Categories' }, ...categories.options]}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          />
        )}

        {brands && (
          <Select
            label="Brand"
            options={[{ value: '', label: 'All Brands' }, ...brands.options]}
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          />
        )}

        {bottleSizes && (
          <Select
            label="Bottle Size"
            options={[{ value: '', label: 'All Sizes' }, ...bottleSizes.options]}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          />
        )}

        {retailers && (
          <Select
            label="Retailer"
            options={[{ value: '', label: 'All Retailers' }, ...retailers.options]}
            value={selectedRetailer}
            onChange={(e) => setSelectedRetailer(e.target.value)}
          />
        )}

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1"
            />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={availabilityOnly}
            onChange={(e) => onAvailabilityChange?.(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm text-foreground">In stock only</span>
        </label>
      </div>

      <Button className="w-full" onClick={handleApply}>
        Apply Filters
      </Button>
    </div>
  )
}

export { SearchFilters }
