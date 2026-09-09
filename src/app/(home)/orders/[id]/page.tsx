'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  ChevronRight,
  AlertTriangle,
  Phone,
  MessageCircle,
} from 'lucide-react'

const orderData = {
  id: 1,
  orderNumber: 'DL-2024-001234',
  date: '2024-01-15T14:30:00',
  status: 'delivered',
  items: [
    {
      id: 1,
      name: 'Johnnie Walker Black Label',
      brand: 'Johnnie Walker',
      price: 3500,
      quantity: 1,
      size: '750ml',
    },
    {
      id: 2,
      name: 'Budweiser Beer',
      brand: 'Budweiser',
      price: 180,
      quantity: 6,
      size: '330ml',
    },
  ],
  subtotal: 4580,
  tax: 824,
  deliveryFee: 49,
  platformFee: 19,
  total: 5472,
  address: {
    label: 'Home',
    address: '123 Main Street, Apt 4B, Downtown',
    city: 'Mumbai',
    pincode: '400001',
  },
  paymentMethod: 'Credit Card (**** 1234)',
  timeline: [
    {
      status: 'Order Placed',
      time: '2024-01-15T14:30:00',
      completed: true,
    },
    {
      status: 'Order Confirmed',
      time: '2024-01-15T14:32:00',
      completed: true,
    },
    {
      status: 'Preparing',
      time: '2024-01-15T14:35:00',
      completed: true,
    },
    {
      status: 'Out for Delivery',
      time: '2024-01-15T15:00:00',
      completed: true,
    },
    {
      status: 'Delivered',
      time: '2024-01-15T15:25:00',
      completed: true,
    },
  ],
  canCancel: false,
}

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle; color: string }> = {
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600',
  },
  in_transit: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-blue-600',
  },
  preparing: {
    label: 'Preparing',
    icon: Clock,
    color: 'text-amber-600',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600',
  },
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const status =
    statusConfig[orderData.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Order Details</h1>
          <p className="text-neutral-500 text-sm">
            {orderData.orderNumber}
          </p>
        </div>
        <span className={`flex items-center gap-1 font-medium ${status.color}`}>
          <StatusIcon className="w-5 h-5" />
          {status.label}
        </span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {orderData.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                      <span className="text-xl">🥃</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.size} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Order Timeline</h2>
            <div className="space-y-4">
              {orderData.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.completed ? 'bg-green-500' : 'bg-neutral-300'
                      }`}
                    />
                    {index < orderData.timeline.length - 1 && (
                      <div
                        className={`w-0.5 flex-1 ${
                          event.completed
                            ? 'bg-green-500'
                            : 'bg-neutral-200 dark:bg-neutral-700'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="font-medium text-sm">{event.status}</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(event.time).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Delivery Address</h2>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-neutral-400 mt-0.5" />
              <div>
                <p className="font-medium">{orderData.address.label}</p>
                <p className="text-sm text-neutral-500">
                  {orderData.address.address}
                </p>
                <p className="text-sm text-neutral-500">
                  {orderData.address.city} - {orderData.address.pincode}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="font-semibold mb-4">Payment Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>₹{orderData.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Tax (18% GST)</span>
                  <span>₹{orderData.tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Delivery Fee</span>
                  <span>₹{orderData.deliveryFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Platform Fee</span>
                  <span>₹{orderData.platformFee}</span>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Paid</span>
                    <span className="font-bold">₹{orderData.total}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-sm">
                  <CreditCard className="w-4 h-4 text-neutral-400" />
                  <span className="text-neutral-500">Paid via</span>
                  <span className="font-medium">{orderData.paymentMethod}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
              <h2 className="font-semibold mb-4">Actions</h2>
              <div className="space-y-3">
                {orderData.status === 'in_transit' && (
                  <Link
                    href={`/orders/${orderData.id}/tracking`}
                    className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 font-medium text-sm"
                  >
                    <Truck className="w-4 h-4" />
                    Track Order
                  </Link>
                )}
                {orderData.status === 'delivered' && (
                  <button className="w-full flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-medium text-sm">
                    <Package className="w-4 h-4" />
                    Reorder
                  </button>
                )}
                {orderData.canCancel && (
                  <button className="w-full flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 font-medium text-sm">
                    <XCircle className="w-4 h-4" />
                    Cancel Order
                  </button>
                )}
                <button className="w-full flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 font-medium text-sm">
                  <MessageCircle className="w-4 h-4" />
                  Contact Support
                </button>
              </div>
            </div>

            {/* Legal Notice */}
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  For any issues with your order, please contact support within
                  24 hours of delivery. Returns are only accepted for defective
                  or incorrect products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
