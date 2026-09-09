'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Order {
  id: string
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  pickupAddress: string
  deliveryAddress: string
  distance: string
  estimatedEarnings: number
  retailerName: string
  customerName?: string
  items: string[]
  createdAt: string
}

const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    status: 'AVAILABLE',
    pickupAddress: '123 Wine St, Downtown',
    deliveryAddress: '456 Beer Ave, Uptown',
    distance: '2.3 km',
    estimatedEarnings: 8.50,
    retailerName: 'Premium Wine Shop',
    items: ['2x Cabernet Sauvignon', '1x Merlot'],
    createdAt: '2 min ago',
  },
  {
    id: 'ORD-1002',
    status: 'AVAILABLE',
    pickupAddress: '789 Spirits Blvd, Midtown',
    deliveryAddress: '321 Cocktail Ln, Eastside',
    distance: '3.1 km',
    estimatedEarnings: 9.75,
    retailerName: 'City Liquors',
    items: ['1x Vodka', '2x Tonic Water'],
    createdAt: '5 min ago',
  },
  {
    id: 'ORD-1003',
    status: 'ASSIGNED',
    pickupAddress: '555 Beer Garden, Westend',
    deliveryAddress: '888 Lager St, Northside',
    distance: '1.8 km',
    estimatedEarnings: 7.25,
    retailerName: 'Craft Beer Co',
    customerName: 'Sarah M.',
    items: ['6x IPA', '2x Stout'],
    createdAt: '10 min ago',
  },
  {
    id: 'ORD-1004',
    status: 'IN_PROGRESS',
    pickupAddress: '42 Oak Street, Downtown',
    deliveryAddress: '100 Pine Avenue, Southside',
    distance: '2.5 km',
    estimatedEarnings: 8.00,
    retailerName: 'Oak Wine Cellar',
    customerName: 'Mike R.',
    items: ['3x Chardonnay'],
    createdAt: '15 min ago',
  },
  {
    id: 'ORD-1005',
    status: 'COMPLETED',
    pickupAddress: '99 Vine Road, Central',
    deliveryAddress: '200 Grape Lane, Heights',
    distance: '1.5 km',
    estimatedEarnings: 6.50,
    retailerName: 'Valley Vineyards',
    customerName: 'Emma L.',
    items: ['1x Champagne', '2x Rosé'],
    createdAt: '1 hour ago',
  },
]

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'>('AVAILABLE')
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  const filteredOrders = orders.filter(order => order.status === activeTab)

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'ASSIGNED' as const } : order
    ))
    alert(`Order ${orderId} accepted! Navigate to retailer.`)
  }

  const handlePickupOrder = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'IN_PROGRESS' as const } : order
    ))
    alert(`Order ${orderId} picked up! Navigate to customer.`)
  }

  const handleCompleteDelivery = (orderId: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: 'COMPLETED' as const } : order
    ))
    alert(`Order ${orderId} delivered! Great job!`)
  }

  const tabs = [
    { key: 'AVAILABLE' as const, label: 'Available', count: orders.filter(o => o.status === 'AVAILABLE').length },
    { key: 'ASSIGNED' as const, label: 'Assigned', count: orders.filter(o => o.status === 'ASSIGNED').length },
    { key: 'IN_PROGRESS' as const, label: 'In Progress', count: orders.filter(o => o.status === 'IN_PROGRESS').length },
    { key: 'COMPLETED' as const, label: 'Completed', count: orders.filter(o => o.status === 'COMPLETED').length },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-blue-100 text-blue-800'
      case 'ASSIGNED': return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-sm p-2">
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-white/20' : 'bg-gray-200'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <span className="text-4xl">📭</span>
            <p className="mt-4 text-gray-500">No {activeTab.toLowerCase()} orders</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
                <span className="text-xs text-gray-500">{order.createdAt}</span>
              </div>

              <div className="space-y-3">
                {/* Pickup */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 text-sm">🏪</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Pickup from</p>
                    <p className="font-medium text-gray-900 truncate">{order.retailerName}</p>
                    <p className="text-sm text-gray-600 truncate">{order.pickupAddress}</p>
                  </div>
                </div>

                {/* Delivery */}
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm">🏠</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500">Deliver to</p>
                    <p className="font-medium text-gray-900 truncate">
                      {order.customerName || 'Customer'}
                    </p>
                    <p className="text-sm text-gray-600 truncate">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>

              {/* Info Bar */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>📍 {order.distance}</span>
                  <span>📦 {order.items.length} items</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ${order.estimatedEarnings.toFixed(2)}
                </span>
              </div>

              {/* Action Button */}
              <div className="mt-4">
                {order.status === 'AVAILABLE' && (
                  <button
                    onClick={() => handleAcceptOrder(order.id)}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors"
                  >
                    Accept Order
                  </button>
                )}
                {order.status === 'ASSIGNED' && (
                  <div className="flex space-x-3">
                    <Link
                      href={`/delivery/order/${order.id}`}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
                    >
                      Navigate to Retailer
                    </Link>
                    <button
                      onClick={() => handlePickupOrder(order.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                    >
                      Confirm Pickup
                    </button>
                  </div>
                )}
                {order.status === 'IN_PROGRESS' && (
                  <div className="flex space-x-3">
                    <Link
                      href={`/delivery/order/${order.id}`}
                      className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
                    >
                      Navigate to Customer
                    </Link>
                    <button
                      onClick={() => handleCompleteDelivery(order.id)}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors"
                    >
                      Complete Delivery
                    </button>
                  </div>
                )}
                {order.status === 'COMPLETED' && (
                  <Link
                    href={`/delivery/order/${order.id}`}
                    className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
