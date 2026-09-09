'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  Heart,
  Shield,
  AlertTriangle,
  Store,
  ChevronRight,
} from 'lucide-react'

const productData = {
  id: 1,
  name: 'Johnnie Walker Black Label',
  brand: 'Johnnie Walker',
  description:
    'Johnnie Walker Black Label is a rich, smooth blend crafted from some of Scotland\'s rarest and most exceptional whiskies. Aged for a minimum of 12 years, it delivers deep layers of flavor with hints of sweet vanilla, dark chocolate, and smoky peat.',
  price: 3500,
  originalPrice: 4200,
  size: '750ml',
  alcoholPercentage: '40%',
  category: 'Whiskey',
  origin: 'Scotland',
  image: '/products/jw-black.jpg',
  rating: 4.7,
  reviewCount: 186,
  inStock: true,
  store: {
    id: 1,
    name: 'Premium Liquors',
    rating: 4.8,
    license: 'LIC-2024-001',
  },
  relatedProducts: [
    {
      id: 2,
      name: 'Jack Daniel\'s Old No. 7',
      brand: 'Jack Daniel\'s',
      price: 3200,
      originalPrice: 3800,
      size: '750ml',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Jameson Irish Whiskey',
      brand: 'Jameson',
      price: 2800,
      originalPrice: 3200,
      size: '750ml',
      rating: 4.6,
    },
    {
      id: 4,
      name: 'Chivas Regal 12',
      brand: 'Chivas',
      price: 3800,
      originalPrice: 4500,
      size: '750ml',
      rating: 4.7,
    },
  ],
}

export default function ProductPage({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const discount = Math.round(
    ((productData.originalPrice - productData.price) /
      productData.originalPrice) *
      100
  )

  return (
    <div className="pb-20 md:pb-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-neutral-500 mb-6">
        <Link href="/home" className="hover:text-blue-600">
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link
          href={`/search?category=${productData.category.toLowerCase()}`}
          className="hover:text-blue-600"
        >
          {productData.category}
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-neutral-900 dark:text-white truncate">
          {productData.name}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="relative">
          <div className="aspect-square rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-850 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
            <span className="text-8xl">🥃</span>
          </div>
          {discount > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-white text-sm font-medium rounded-full">
              {discount}% OFF
            </span>
          )}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute top-4 right-4 p-3 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm shadow-lg hover:scale-105 transition-all"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite
                  ? 'text-red-500 fill-red-500'
                  : 'text-neutral-500'
              }`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2">
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {productData.brand}
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            {productData.name}
          </h1>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-medium">{productData.rating}</span>
              <span className="text-neutral-500">
                ({productData.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-blue-600">
              ₹{productData.price}
            </span>
            {productData.originalPrice > productData.price && (
              <>
                <span className="text-lg text-neutral-400 line-through">
                  ₹{productData.originalPrice}
                </span>
                <span className="text-sm text-green-600 font-medium">
                  Save ₹{productData.originalPrice - productData.price}
                </span>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Size</p>
              <p className="font-medium">{productData.size}</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Alcohol %</p>
              <p className="font-medium">{productData.alcoholPercentage}</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Category</p>
              <p className="font-medium">{productData.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs text-neutral-500 mb-1">Origin</p>
              <p className="font-medium">{productData.origin}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
              {productData.description}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-xl">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-xl transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg transition-colors flex items-center justify-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5" />
            Add to Cart - ₹{productData.price * quantity}
          </button>

          {/* Store Info */}
          <Link
            href={`/store/${productData.store.id}`}
            className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">{productData.store.name}</p>
                <p className="text-xs text-neutral-500">
                  License: {productData.store.license}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400" />
          </Link>

          {/* Age Restriction Notice */}
          <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                  Age Restriction
                </p>
                <p className="text-amber-600 dark:text-amber-400">
                  You must be 18+ to purchase this product. Age verification
                  will be required at the time of delivery. Please drink
                  responsibly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {productData.relatedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-lg transition-all"
            >
              <div className="h-32 bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 flex items-center justify-center">
                <span className="text-3xl">🥃</span>
              </div>
              <div className="p-3">
                <p className="text-xs text-neutral-500 mb-1">{product.brand}</p>
                <h3 className="font-medium text-sm line-clamp-1 mb-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-600">
                    ₹{product.price}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-neutral-500">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    {product.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="mt-8 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-xs text-neutral-500">
            <p className="mb-2">
              <strong>Legal Disclaimer:</strong> Alcohol delivery is subject to
              local and state regulations. Prices include all applicable taxes.
              The images shown are for representation purposes only and may
              differ from the actual product.
            </p>
            <p>
              By purchasing this product, you confirm that you are of legal
              drinking age in your jurisdiction. Drinkly and its partner
              retailers reserve the right to refuse service to anyone who
              appears to be intoxicated or unable to provide valid age
              verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
