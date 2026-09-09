'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  ChevronRight,
  Star,
  Clock,
  ShoppingCart,
} from 'lucide-react'

const featuredProducts = [
  {
    id: 1,
    name: 'Johnnie Walker Black Label',
    brand: 'Johnnie Walker',
    price: 3500,
    originalPrice: 4200,
    image: '/products/jw-black.jpg',
    category: 'Whiskey',
    rating: 4.7,
    store: 'Premium Liquors',
  },
  {
    id: 2,
    name: 'Absolut Vodka',
    brand: 'Absolut',
    price: 1800,
    originalPrice: 2200,
    image: '/products/absolut.jpg',
    category: 'Vodka',
    rating: 4.5,
    store: 'City Wine Shop',
  },
  {
    id: 3,
    name: 'Budweiser Beer',
    brand: 'Budweiser',
    price: 180,
    originalPrice: 200,
    image: '/products/budweiser.jpg',
    category: 'Beer',
    rating: 4.3,
    store: 'The Beer Hub',
  },
  {
    id: 4,
    name: 'Merlot Red Wine',
    brand: 'Robert Mondavi',
    price: 2400,
    originalPrice: 2800,
    image: '/products/merlot.jpg',
    category: 'Wine',
    rating: 4.6,
    store: 'City Wine Shop',
  },
  {
    id: 5,
    name: 'Captain Morgan Rum',
    brand: 'Captain Morgan',
    price: 1500,
    originalPrice: 1800,
    image: '/products/captain.jpg',
    category: 'Rum',
    rating: 4.4,
    store: 'Premium Liquors',
  },
]

const categories = [
  { id: 1, name: 'Beer', icon: '🍺', color: 'from-amber-500 to-orange-500' },
  { id: 2, name: 'Wine', icon: '🍷', color: 'from-red-500 to-pink-500' },
  { id: 3, name: 'Spirits', icon: '🥃', color: 'from-amber-600 to-yellow-500' },
  { id: 4, name: 'Whiskey', icon: '🥃', color: 'from-amber-700 to-orange-600' },
  { id: 5, name: 'Vodka', icon: '🍸', color: 'from-blue-400 to-cyan-400' },
  { id: 6, name: 'Rum', icon: '🍹', color: 'from-amber-500 to-yellow-400' },
  { id: 7, name: 'Gin', icon: '🫧', color: 'from-teal-400 to-green-400' },
  { id: 8, name: 'RTD', icon: '🥤', color: 'from-purple-400 to-pink-400' },
]

const nearbyStores = [
  {
    id: 1,
    name: 'Premium Liquors',
    rating: 4.8,
    deliveryTime: '30-45 min',
    distance: '1.2 km',
    license: 'LIC-2024-001',
  },
  {
    id: 2,
    name: 'City Wine Shop',
    rating: 4.6,
    deliveryTime: '25-40 min',
    distance: '0.8 km',
    license: 'LIC-2024-002',
  },
  {
    id: 3,
    name: 'The Beer Hub',
    rating: 4.7,
    deliveryTime: '20-35 min',
    distance: '2.1 km',
    license: 'LIC-2024-003',
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for drinks, brands, stores..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg shadow-sm"
        />
      </div>

      {/* Featured Products */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Featured Products</h2>
          <Link
            href="/search"
            className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="flex-shrink-0 w-48 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-40 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-850 flex items-center justify-center">
                <span className="text-4xl">
                  {product.category === 'Beer'
                    ? '🍺'
                    : product.category === 'Wine'
                    ? '🍷'
                    : product.category === 'Vodka'
                    ? '🍸'
                    : product.category === 'Rum'
                    ? '🍹'
                    : '🥃'}
                </span>
              </div>
              <div className="p-3">
                <p className="text-xs text-neutral-500 mb-1">
                  {product.brand}
                </p>
                <h3 className="font-medium text-sm line-clamp-1 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-600">
                    ₹{product.price}
                  </span>
                  <span className="text-xs text-neutral-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  <span className="text-xs text-neutral-500">
                    {product.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Categories</h2>
          <Link
            href="/categories"
            className="text-blue-600 dark:text-blue-400 text-sm font-medium flex items-center gap-1"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/search?category=${category.name.toLowerCase()}`}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-colors"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center text-2xl`}
              >
                {category.icon}
              </div>
              <span className="text-xs font-medium text-center">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Nearby Stores */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Nearby Stores</h2>
        </div>
        <div className="space-y-3">
          {nearbyStores.map((store) => (
            <Link
              key={store.id}
              href={`/store/${store.id}`}
              className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                  <span className="text-2xl">🏪</span>
                </div>
                <div>
                  <h3 className="font-semibold">{store.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {store.rating}
                    </span>
                    <span>•</span>
                    <span>{store.distance}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm text-neutral-500">
                  <Clock className="w-4 h-4" />
                  {store.deliveryTime}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Age Restriction Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
        <p className="text-sm text-amber-700 dark:text-amber-300">
          <strong>Age Restriction:</strong> You must be 18+ to order alcohol.
          Age verification is required at delivery. Please drink responsibly.
        </p>
      </div>
    </div>
  )
}
