'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  Clock,
  MapPin,
  Shield,
  ShoppingCart,
  Plus,
  Minus,
  AlertTriangle,
} from 'lucide-react'

const storeData = {
  id: 1,
  name: 'Premium Liquors',
  image: '/stores/premium.jpg',
  banner: '/stores/premium-banner.jpg',
  rating: 4.8,
  reviewCount: 245,
  deliveryTime: '30-45 min',
  minimumOrder: 500,
  distance: '1.2 km',
  licenseNumber: 'LIC-2024-001',
  address: '123 Main Street, Downtown',
  isOpen: true,
  openingHours: '10:00 AM - 10:00 PM',
  categories: [
    {
      name: 'Whiskey',
      products: [
        {
          id: 1,
          name: 'Johnnie Walker Black Label',
          price: 3500,
          originalPrice: 4200,
          size: '750ml',
          image: '/products/jw-black.jpg',
        },
        {
          id: 2,
          name: 'Jack Daniel\'s Old No. 7',
          price: 3200,
          originalPrice: 3800,
          size: '750ml',
          image: '/products/jd.jpg',
        },
        {
          id: 3,
          name: 'Jameson Irish Whiskey',
          price: 2800,
          originalPrice: 3200,
          size: '750ml',
          image: '/products/jameson.jpg',
        },
      ],
    },
    {
      name: 'Vodka',
      products: [
        {
          id: 4,
          name: 'Absolut Vodka',
          price: 1800,
          originalPrice: 2200,
          size: '750ml',
          image: '/products/absolut.jpg',
        },
        {
          id: 5,
          name: 'Grey Goose',
          price: 4500,
          originalPrice: 5200,
          size: '750ml',
          image: '/products/grey-goose.jpg',
        },
      ],
    },
    {
      name: 'Beer',
      products: [
        {
          id: 6,
          name: 'Budweiser',
          price: 180,
          originalPrice: 200,
          size: '330ml',
          image: '/products/budweiser.jpg',
        },
        {
          id: 7,
          name: 'Heineken',
          price: 200,
          originalPrice: 220,
          size: '330ml',
          image: '/products/heineken.jpg',
        },
        {
          id: 8,
          name: 'Corona',
          price: 220,
          originalPrice: 250,
          size: '330ml',
          image: '/products/corona.jpg',
        },
      ],
    },
  ],
}

export default function StorePage({ params }: { params: { id: string } }) {
  const [cart, setCart] = useState<Record<number, number>>({})

  const addToCart = (productId: number) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: number) => {
    setCart((prev) => {
      if (prev[productId] && prev[productId] > 1) {
        return { ...prev, [productId]: prev[productId] - 1 }
      }
      const newCart = { ...prev }
      delete newCart[productId]
      return newCart
    })
  }

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0)
  const totalPrice = storeData.categories
    .flatMap((cat) => cat.products)
    .reduce((sum, product) => {
      return sum + product.price * (cart[product.id] || 0)
    }, 0)

  return (
    <div className="pb-20 md:pb-0">
      {/* Store Banner */}
      <div className="relative h-48 md:h-64 rounded-2xl overflow-hidden mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
        {!storeData.isOpen && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <div className="text-center text-white">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3" />
              <h2 className="text-xl font-bold mb-1">Store is Currently Closed</h2>
              <p className="text-white/80">
                Opens at {storeData.openingHours}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Store Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">{storeData.name}</h1>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              {storeData.rating} ({storeData.reviewCount} reviews)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {storeData.deliveryTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {storeData.distance}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          Open
        </div>
      </div>

      {/* Store Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1">Address</p>
          <p className="text-sm font-medium">{storeData.address}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1">Hours</p>
          <p className="text-sm font-medium">{storeData.openingHours}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1">Delivery Time</p>
          <p className="text-sm font-medium">{storeData.deliveryTime}</p>
        </div>
        <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <p className="text-xs text-neutral-500 mb-1">Minimum Order</p>
          <p className="text-sm font-medium">₹{storeData.minimumOrder}</p>
        </div>
      </div>

      {/* Products by Category */}
      {storeData.categories.map((category) => (
        <div key={category.name} className="mb-8">
          <h2 className="text-lg font-bold mb-4">{category.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {category.products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
              >
                <Link href={`/product/${product.id}`}>
                  <div className="h-32 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 flex items-center justify-center">
                    <span className="text-3xl">🥃</span>
                  </div>
                </Link>
                <div className="p-3">
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
                    {cart[product.id] ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-6 text-center">
                          {cart[product.id]}
                        </span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Legal Notice */}
      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-20 md:mb-0">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            <p className="font-medium text-neutral-900 dark:text-white mb-1">
              Licensed Retailer
            </p>
            <p>
              License Number: {storeData.licenseNumber}. This store is authorized
              to sell alcoholic beverages as per local regulations. Age
              verification is required for all orders.
            </p>
          </div>
        </div>
      </div>

      {/* Cart Summary */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40">
          <Link
            href="/cart"
            className="flex items-center justify-between p-4 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{totalItems} items</p>
                <p className="text-sm text-blue-100">₹{totalPrice}</p>
              </div>
            </div>
            <span className="font-semibold">View Cart →</span>
          </Link>
        </div>
      )}
    </div>
  )
}
