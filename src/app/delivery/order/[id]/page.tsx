'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface OrderDetail {
  id: string
  status: 'ASSIGNED' | 'PICKING_UP' | 'DELIVERING' | 'COMPLETED'
  pickupAddress: string
  deliveryAddress: string
  deliveryInstructions?: string
  customerName: string
  customerPhone: string
  retailerName: string
  retailerPhone: string
  items: { name: string; quantity: number }[]
  estimatedEarnings: number
  tip: number
  createdAt: string
  timeline: { status: string; time: string; completed: boolean }[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching order details
    const mockOrder: OrderDetail = {
      id: orderId,
      status: 'ASSIGNED',
      pickupAddress: '123 Wine St, Downtown, City 12345',
      deliveryAddress: '456 Beer Ave, Uptown, City 12345',
      deliveryInstructions: 'Leave at door, ring doorbell twice',
      customerName: 'John D.',
      customerPhone: '+1 (555) 123-4567',
      retailerName: 'Premium Wine Shop',
      retailerPhone: '+1 (555) 987-6543',
      items: [
        { name: 'Cabernet Sauvignon 2018', quantity: 2 },
        { name: 'Merlot Reserve', quantity: 1 },
      ],
      estimatedEarnings: 8.50,
      tip: 2.00,
      createdAt: '10:30 AM',
      timeline: [
        { status: 'Order Placed', time: '10:30 AM', completed: true },
        { status: 'Driver Assigned', time: '10:32 AM', completed: true },
        { status: 'Arrived at Retailer', time: '', completed: false },
        { status: 'Picked Up', time: '', completed: false },
        { status: 'Delivered', time: '', completed: false },
      ],
    }
    setOrder(mockOrder)
    setLoading(false)
  }, [orderId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-blue-500'
      case 'PICKING_UP': return 'bg-yellow-500'
      case 'DELIVERING': return 'bg-green-500'
      case 'COMPLETED': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Order not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/delivery/orders" className="text-purple-600 font-medium">
          ← Back
        </Link>
        <h1 className="text-lg font-bold text-gray-900">{order.id}</h1>
        <div className="w-16"></div>
      </div>

      {/* Status Banner */}
      <div className={`${getStatusColor(order.status)} rounded-2xl p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-white/80">Current Status</p>
            <p className="text-xl font-bold">{order.status.replace('_', ' ')}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-white/80">Est. Earnings</p>
            <p className="text-xl font-bold">${(order.estimatedEarnings + order.tip).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Order Timeline</h3>
        <div className="space-y-3">
          {order.timeline.map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                item.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className="flex-1">
                <p className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                  {item.status}
                </p>
                {item.time && (
                  <p className="text-sm text-gray-500">{item.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Info - Limited for privacy */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3">Customer</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600">👤</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{order.customerName}</p>
              <p className="text-sm text-gray-500">Customer</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
            <p className="text-gray-900">{order.deliveryAddress}</p>
          </div>
          
          {order.deliveryInstructions && (
            <div className="bg-yellow-50 rounded-xl p-3">
              <p className="text-xs text-yellow-700 mb-1">⚠️ Delivery Instructions</p>
              <p className="text-yellow-800">{order.deliveryInstructions}</p>
            </div>
          )}
          
          <a
            href={`tel:${order.customerPhone}`}
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
          >
            📞 Call Customer
          </a>
        </div>
      </div>

      {/* Retailer Info */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3">Retailer</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600">🏪</span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{order.retailerName}</p>
              <p className="text-sm text-gray-500">Pickup Location</p>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">Pickup Address</p>
            <p className="text-gray-900">{order.pickupAddress}</p>
          </div>
          
          <a
            href={`tel:${order.retailerPhone}`}
            className="block w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
          >
            📞 Call Retailer
          </a>
        </div>
      </div>

      {/* Items List */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3">Items to Pick Up</h3>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-gray-900">{item.name}</span>
              <span className="text-gray-500">×{item.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <span className="text-4xl">🗺️</span>
            <p className="mt-2 text-sm">Route Map</p>
            <p className="text-xs text-gray-400">Integrate with Google Maps API</p>
          </div>
        </div>
      </div>

      {/* Earnings Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-3">Earnings</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery Fee</span>
            <span className="font-medium">${order.estimatedEarnings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tip</span>
            <span className="font-medium">${order.tip.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-bold text-green-600">${(order.estimatedEarnings + order.tip).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-4">
        {order.status === 'ASSIGNED' && (
          <>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.pickupAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
            >
              🗺️ Navigate to Retailer
            </a>
            <button
              onClick={() => {
                alert('Pickup confirmed! Check items against order list.')
                setOrder(prev => prev ? { ...prev, status: 'PICKING_UP' } : null)
              }}
              className="block w-full bg-green-600 text-white py-4 rounded-xl font-bold text-center hover:bg-green-700 transition-colors"
            >
              ✅ Confirm Pickup
            </button>
          </>
        )}
        
        {order.status === 'PICKING_UP' && (
          <>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(order.deliveryAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-center hover:bg-blue-700 transition-colors"
            >
              🗺️ Navigate to Customer
            </a>
            <button
              onClick={() => {
                alert('Please verify customer identity before completing delivery.')
                setOrder(prev => prev ? { ...prev, status: 'DELIVERING' } : null)
              }}
              className="block w-full bg-yellow-500 text-white py-4 rounded-xl font-bold text-center hover:bg-yellow-600 transition-colors"
            >
              🔍 Verify Customer Identity
            </button>
          </>
        )}
        
        {order.status === 'DELIVERING' && (
          <button
            onClick={() => {
              if (confirm('Confirm delivery completed? Customer should have received their order.')) {
                alert('Delivery completed! Great job!')
                setOrder(prev => prev ? { ...prev, status: 'COMPLETED' } : null)
              }
            }}
            className="block w-full bg-green-600 text-white py-4 rounded-xl font-bold text-center hover:bg-green-700 transition-colors"
          >
            ✅ Complete Delivery
          </button>
        )}
        
        {order.status === 'COMPLETED' && (
          <div className="bg-green-50 rounded-2xl p-4 text-center">
            <span className="text-4xl">🎉</span>
            <p className="mt-2 font-bold text-green-800">Delivery Completed!</p>
            <p className="text-sm text-green-600">You earned ${(order.estimatedEarnings + order.tip).toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  )
}
