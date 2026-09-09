'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  ShoppingCart,
  ChevronDown,
} from 'lucide-react'

const allProducts = [
  {
    id: 1,
    name: 'Johnnie Walker Black Label',
    brand: 'Johnnie Walker',
    price: 3500,
    originalPrice: 4200,
    category: 'whiskey',
    size: '750ml',
    rating: 4.7,
    image: '/products/jw-black.jpg',
  },
  {
    id: 2,
    name: 'Absolut Vodka',
    brand: 'Absolut',
    price: 1800,
    originalPrice: 2200,
    category: 'vodka',
    size: '750ml',
    rating: 4.5,
    image: '/products/absolut.jpg',
  },
  {
    id: 3,
    name: 'Budweiser Beer',
    brand: 'Budweiser',
    price: 180,
    originalPrice: 200,
    category: 'beer',
    size: '330ml',
    rating: 4.3,
    image: '/products/budweiser.jpg',
  },
  {
    id: 4,
    name: 'Merlot Red Wine',
    brand: 'Robert Mondavi',
    price: 2400,
    originalPrice: 2800,
    category: 'wine',
    size: '750ml',
    rating: 4.6,
    image: '/products/merlot.jpg',
  },
  {
    id: 5,
    name: 'Captain Morgan Rum',
    brand: 'Captain Morgan',
    price: 1500,
    originalPrice: 1800,
    category: 'rum',
    size: '750ml',
    rating: 4.4,
    image: '/products/captain.jpg',
  },
  {
    id: 6,
    name: 'Tanqueray Gin',
    brand: 'Tanqueray',
    price: 2200,
    originalPrice: 2600,
    category: 'gin',
    size: '750ml',
    rating: 4.6,
    image: '/products/tanqueray.jpg',
  },
  {
    id: 7,
    name: 'Heineken Beer',
    brand: 'Heineken',
    price: 200,
    originalPrice: 220,
    category: 'beer',
    size: '330ml',
    rating: 4.4,
    image: '/products/heineken.jpg',
  },
  {
    id: 8,
    name: 'Jack Daniel\'s Whiskey',
    brand: 'Jack Daniel\'s',
    price: 3200,
    originalPrice: 3800,
    category: 'whiskey',
    size: '750ml',
    rating: 4.8,
    image: '/products/jd.jpg',
  },
]

const filterOptions = {
  categories: ['Beer', 'Wine', 'Whiskey', 'Vodka', 'Rum', 'Gin', 'RTD'],
  brands: [
    'Johnnie Walker',
    'Absolut',
    'Budweiser',
    'Heineken',
    'Captain Morgan',
    'Tanqueray',
    'Jack Daniel\'s',
  ],
  priceRanges: [
    { label: 'Under ₹500', min: 0, max: 500 },
    { label: '₹500 - ₹1500', min: 500, max: 1500 },
    { label: '₹1500 - ₹3000', min: 1500, max: 3000 },
    { label: 'Above ₹3000', min: 3000, max: Infinity },
  ],
  sizes: ['330ml', '500ml', '650ml', '750ml', '1L'],
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') || ''
  const initialQuery = searchParams.get('q') || ''

  const [query, setQuery] = useState(initialQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts = allProducts.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory.toLowerCase()
    const matchesBrand = !selectedBrand || product.brand === selectedBrand
    const matchesSize = !selectedSize || product.size === selectedSize

    let matchesPrice = true
    if (selectedPriceRange) {
      const range = filterOptions.priceRanges.find(
        (r) => r.label === selectedPriceRange
      )
      if (range) {
        matchesPrice = product.price >= range.min && product.price <= range.max
      }
    }

    return matchesQuery && matchesCategory && matchesBrand && matchesPrice && matchesSize
  })

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedBrand('')
    setSelectedPriceRange('')
    setSelectedSize('')
    setQuery('')
  }

  const hasFilters =
    selectedCategory || selectedBrand || selectedPriceRange || selectedSize

  return (
    <div className="pb-20 md:pb-0">
      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for drinks, brands..."
          className="w-full pl-12 pr-12 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filters</h3>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Category */}
            <div>
              <h4 className="text-sm font-medium mb-3">Category</h4>
              <div className="space-y-2">
                {filterOptions.categories.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === cat.toLowerCase()}
                      onChange={() =>
                        setSelectedCategory(
                          selectedCategory === cat.toLowerCase() ? '' : cat.toLowerCase()
                        )
                      }
                      className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    {cat}
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-3">Price Range</h4>
              <div className="space-y-2">
                {filterOptions.priceRanges.map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange === range.label}
                      onChange={() =>
                        setSelectedPriceRange(
                          selectedPriceRange === range.label ? '' : range.label
                        )
                      }
                      className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
                    />
                    {range.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <h4 className="text-sm font-medium mb-3">Size</h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(selectedSize === size ? '' : size)
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      selectedSize === size
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="md:hidden mb-4 flex items-center gap-2">
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-neutral-500">
              {loading ? 'Searching...' : `${filteredProducts.length} products found`}
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden animate-pulse"
                >
                  <div className="h-40 bg-neutral-200 dark:bg-neutral-800" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-3/4" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No products found</h3>
              <p className="text-neutral-500 mb-4">
                Try adjusting your search or filters
              </p>
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="h-40 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 flex items-center justify-center relative">
                    <span className="text-4xl">
                      {product.category === 'beer'
                        ? '🍺'
                        : product.category === 'wine'
                        ? '🍷'
                        : product.category === 'vodka'
                        ? '🍸'
                        : product.category === 'rum'
                        ? '🍹'
                        : '🥃'}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-neutral-500 mb-1">
                      {product.brand}
                    </p>
                    <h3 className="font-medium text-sm line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mb-2">
                      {product.size}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">
                          ₹{product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-neutral-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          // Add to cart logic
                        }}
                        className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-neutral-900 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Mobile filter options would go here */}
          </div>
        </div>
      )}
    </div>
  )
}
