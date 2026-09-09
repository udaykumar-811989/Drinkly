'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface CurrentOrder {
  id: string
  status: 'ASSIGNED' | 'PICKING_UP' | 'DELIVERING'
  pickupAddress: string
  deliveryAddress: string
  customerName: string
  retailerName: string
  estimatedEarnings: number
}

export default function DashboardPage() {
  const [isOnline, setIsOnline] = useState(false)
  const [currentOrder, setCurrentOrder] = useState<CurrentOrder | null>(null)
  const [stats, setStats] = useState({
    deliveriesToday: 0,
    earningsToday: 0,
    rating: 0,
  })

  useEffect(() => {
    // Simulate fetching today's stats
    setStats({
      deliveriesToday: 5,
      earningsToday: 47.50,
      rating: 4.9,
    })

    // Simulate checking for current order
    const mockCurrentOrder: CurrentOrder = {
      id: 'ORD-12345',
      status: 'ASSIGNED',
      pickupAddress: '123 Wine St, Downtown',
      deliveryAddress: '456 Beer Ave, Uptown',
      customerName: 'John D.',
      retailerName: 'Premium Wine Shop',
      estimatedEarnings: 8.50,
    }
    setCurrentOrder(mockCurrentOrder)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-100 text-blue-800'
      case 'PICKING_UP': return 'bg-yellow-100 text-yellow-800'
      case 'DELIVERING': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Online/Offline Toggle - Prominent */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Your Status</h2>
            <p className="text-gray-500">
              {isOnline ? 'You are accepting deliveries' : 'You are offline'}
            </p>
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className={`relative inline-flex h-12 w-20 items-center rounded-full transition-colors ${
              isOnline ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform shadow-lg ${
                isOnline ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        {isOnline && (
          <div className="mt-4 flex items-center text-green-600">
            <span className="animate-pulse mr-2">●</span>
            <span className="text-sm font-medium">Ready for deliveries</span>
          </div>
        )}
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-purple-600">{stats.deliveriesToday}</div>
          <div className="text-sm text-gray-500 mt-1">Deliveries</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-green-600">${stats.earningsToday.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">Earnings</div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 text-center">
          <div className="text-3xl font-bold text-yellow-500">{stats.rating}</div>
          <div className="text-sm text-gray-500 mt-1">Rating</div>
        </div>
      </div>

      {/* Current Order Card */}
      {currentOrder && (
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Current Order</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
              {currentOrder.status.replace('_', ' ')}
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                🏪
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80">Pickup from</p>
                <p className="font-medium truncate">{currentOrder.retailerName}</p>
                <p className="text-sm text-white/80 truncate">{currentOrder.pickupAddress}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-0.5 h-8 bg-white/30"></div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                🏠
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80">Deliver to</p>
                <p className="font-medium truncate">{currentOrder.customerName}</p>
                <p className="text-sm text-white/80 truncate">{currentOrder.deliveryAddress}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold">${currentOrder.estimatedEarnings.toFixed(2)}</span>
            <Link
              href={`/delivery/order/${currentOrder.id}`}
              className="bg-white text-purple-600 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors"
            >
              View Order
            </Link>
          </div>
        </div>
      )}

      {/* Map Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <span className="text-4xl">🗺️</span>
            <p className="mt-2 text-sm">Map showing current location</p>
            <p className="text-xs text-gray-400">Integrate with Google Maps API</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/delivery/orders"
          className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">📦</span>
          <p className="mt-2 font-medium text-gray-900">View Orders</p>
          <p className="text-sm text-gray-500">3 available nearby</p>
        </Link>
        
        <Link
          href="/delivery/earnings"
          className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">💰</span>
          <p className="mt-2 font-medium text-gray-900">Earnings</p>
          <p className="text-sm text-gray-500">View history</p>
        </Link>
        
        <Link
          href="/delivery/settings"
          className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
        >
          <span className="text-3xl">⚙️</span>
          <p className="mt-2 font-medium text-gray-900">Settings</p>
          <p className="text-sm text-gray-500">Preferences</p>
        </Link>
        
        <button
          className="bg-white rounded-2xl shadow-sm p-4 text-center hover:shadow-md transition-shadow"
          onClick={() => {
            // Play notification sound placeholder
            alert('Notification sound would play here')
          }}
        >
          <span className="text-3xl">🔔</span>
          <p className="mt-2 font-medium text-gray-900">Test Alert</p>
          <p className="text-sm text-gray-500">Notification sound</p>
        </button>
      </div>
    </div>
  )
}
