'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'

const initialFavorites = [
  {
    id: 1,
    name: 'Johnnie Walker Black Label',
    brand: 'Johnnie Walker',
    price: 3500,
    originalPrice: 4200,
    size: '750ml',
    category: 'Whiskey',
    image: '/products/jw-black.jpg',
  },
  {
    id: 2,
    name: 'Absolut Vodka',
    brand: 'Absolut',
    price: 1800,
    originalPrice: 2200,
    size: '750ml',
    category: 'Vodka',
    image: '/products/absolut.jpg',
  },
  {
    id: 3,
    name: 'Heineken Beer',
    brand: 'Heineken',
    price: 200,
    originalPrice: 220,
    size: '330ml',
    category: 'Beer',
    image: '/products/heineken.jpg',
  },
  {
    id: 4,
    name: 'Merlot Red Wine',
    brand: 'Robert Mondavi',
    price: 2400,
    originalPrice: 2800,
    size: '750ml',
    category: 'Wine',
    image: '/products/merlot.jpg',
  },
]

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(initialFavorites)

  const removeFromFavorites = (id: number) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id))
  }

  const addToCart = (id: number) => {
    // TODO: Implement add to cart
    removeFromFavorites(id)
  }

  if (favorites.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <Heart className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mb-6" />
        <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
        <p className="text-neutral-500 mb-6">
          Save items you love to your favorites
        </p>
        <Link
          href="/home"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {favorites.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <Link href={`/product/${product.id}`}>
              <div className="relative h-40 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 flex items-center justify-center">
                <span className="text-4xl">
                  {product.category === 'Beer'
                    ? '🍺'
                    : product.category === 'Wine'
                    ? '🍷'
                    : product.category === 'Vodka'
                    ? '🍸'
                    : '🥃'}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    removeFromFavorites(product.id)
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                </button>
              </div>
            </Link>
            <div className="p-3">
              <p className="text-xs text-neutral-500 mb-1">{product.brand}</p>
              <Link href={`/product/${product.id}`}>
                <h3 className="font-medium text-sm line-clamp-1 mb-1 hover:text-blue-600">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-neutral-400 mb-2">{product.size}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-600">
                    ₹{product.price}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-xs text-neutral-400 line-through ml-1">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product.id)}
                  className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
