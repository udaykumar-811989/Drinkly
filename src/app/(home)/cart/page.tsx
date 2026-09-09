'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  Store,
} from 'lucide-react'

const initialCartItems = [
  {
    id: 1,
    name: 'Johnnie Walker Black Label',
    brand: 'Johnnie Walker',
    price: 3500,
    size: '750ml',
    quantity: 1,
    store: 'Premium Liquors',
    image: '/products/jw-black.jpg',
  },
  {
    id: 2,
    name: 'Budweiser Beer',
    brand: 'Budweiser',
    price: 180,
    size: '330ml',
    quantity: 6,
    store: 'The Beer Hub',
    image: '/products/budweiser.jpg',
  },
]

const MINIMUM_ORDER = 500
const DELIVERY_FEE = 49
const PLATFORM_FEE = 19

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, delta: number) => {
    setCartItems((items) =>
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = Math.round(subtotal * 0.18)
  const deliveryFee = subtotal >= MINIMUM_ORDER ? DELIVERY_FEE : 0
  const total = subtotal + tax + deliveryFee + PLATFORM_FEE
  const isMinimumMet = subtotal >= MINIMUM_ORDER

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <ShoppingCart className="w-20 h-20 text-neutral-300 dark:text-neutral-600 mb-6" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-neutral-500 mb-6">
          Looks like you haven&apos;t added any items yet
        </p>
        <Link
          href="/home"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800"
            >
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🥃</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-blue-600 mb-0.5">{item.brand}</p>
                    <h3 className="font-medium line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {item.size}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="font-bold text-blue-600">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>

            {!isMinimumMet && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 mb-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Minimum order is ₹{MINIMUM_ORDER}. Add ₹
                    {MINIMUM_ORDER - subtotal} more to proceed.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Tax (18% GST)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Delivery Fee</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Platform Fee</span>
                <span>₹{PLATFORM_FEE}</span>
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">₹{total}</span>
              </div>
            </div>

            <Link
              href={isMinimumMet ? '/checkout' : '#'}
              className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                isMinimumMet
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed'
              }`}
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/home"
              className="w-full mt-3 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 font-medium text-center block hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
