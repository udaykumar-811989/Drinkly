'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: 'Beer',
    description: 'Lagers, ales, stouts, and more',
    image: '/categories/beer.jpg',
    color: 'from-amber-500 to-orange-500',
    productCount: 120,
  },
  {
    id: 2,
    name: 'Wine',
    description: 'Red, white, rose, and sparkling',
    image: '/categories/wine.jpg',
    color: 'from-red-500 to-pink-500',
    productCount: 85,
  },
  {
    id: 3,
    name: 'Spirits',
    description: 'Premium spirits and liqueurs',
    image: '/categories/spirits.jpg',
    color: 'from-amber-600 to-yellow-500',
    productCount: 95,
  },
  {
    id: 4,
    name: 'Whiskey',
    description: 'Scotch, bourbon, Irish, and more',
    image: '/categories/whiskey.jpg',
    color: 'from-amber-700 to-orange-600',
    productCount: 60,
  },
  {
    id: 5,
    name: 'Vodka',
    description: 'Classic and flavored vodkas',
    image: '/categories/vodka.jpg',
    color: 'from-blue-400 to-cyan-400',
    productCount: 40,
  },
  {
    id: 6,
    name: 'Rum',
    description: 'Dark, light, and spiced rums',
    image: '/categories/rum.jpg',
    color: 'from-amber-500 to-yellow-400',
    productCount: 35,
  },
  {
    id: 7,
    name: 'Gin',
    description: 'London dry, old tom, and more',
    image: '/categories/gin.jpg',
    color: 'from-teal-400 to-green-400',
    productCount: 30,
  },
  {
    id: 8,
    name: 'Ready to Drink',
    description: 'Cocktails, hard seltzers, and more',
    image: '/categories/rtd.jpg',
    color: 'from-purple-400 to-pink-400',
    productCount: 55,
  },
]

export default function CategoriesPage() {
  return (
    <div className="pb-20 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Categories</h1>
        <p className="text-neutral-500">
          Browse our selection of alcoholic beverages
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/search?category=${category.name.toLowerCase()}`}
            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center gap-4 p-6">
              <div
                className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-3xl">
                  {category.name === 'Beer'
                    ? '🍺'
                    : category.name === 'Wine'
                    ? '🍷'
                    : category.name === 'Vodka'
                    ? '🍸'
                    : category.name === 'Rum'
                    ? '🍹'
                    : category.name === 'Ready to Drink'
                    ? '🥤'
                    : '🥃'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-neutral-500 mb-1">
                  {category.description}
                </p>
                <p className="text-xs text-neutral-400">
                  {category.productCount} products
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
