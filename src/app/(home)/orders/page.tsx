'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Clock,
  ChevronRight,
  RotateCcw,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react'

const orders = [
  {
    id: 1,
    orderNumber: 'DL-2024-001234',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { name: 'Johnnie Walker Black Label', quantity: 1, price: 3500 },
      { name: 'Budweiser Beer', quantity: 6, price: 1080 },
    ],
    total: 4789,
  },
  {
    id: 2,
    orderNumber: 'DL-2024-001235',
    date: '2024-01-14',
    status: 'in_transit',
    items: [{ name: 'Absolut Vodka', quantity: 1, price: 1800 }],
    total: 2179,
  },
  {
    id: 3,
    orderNumber: 'DL-2024-001236',
    date: '2024-01-13',
    status: 'cancelled',
    items: [{ name: 'Captain Morgan Rum', quantity: 1, price: 1500 }],
    total: 1819,
  },
  {
    id: 4,
    orderNumber: 'DL-2024-001237',
    date: '2024-01-12',
    status: 'delivered',
    items: [
      { name: 'Heineken Beer', quantity: 12, price: 2400 },
      { name: 'Corona Beer', quantity: 6, price: 1320 },
    ],
    total: 4519,
  },
]

const statusConfig = {
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  },
  in_transit: {
    label: 'In Transit',
    icon: Truck,
    color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  },
  preparing: {
    label: 'Preparing',
    icon: Clock,
    color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  },
}

const filters = ['All', 'Delivered', 'In Transit', 'Preparing', 'Cancelled']

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredOrders =
    activeFilter === 'All'
      ? orders
      : orders.filter(
          (order) =>
            statusConfig[order.status as keyof typeof statusConfig]?.label ===
            activeFilter
        )

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2 -mx-4 px-4">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-blue-600 text-white'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
          <Package className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
          <h2 className="text-lg font-semibold mb-2">No orders found</h2>
          <p className="text-neutral-500 mb-6">
            {activeFilter === 'All'
              ? "You haven't placed any orders yet"
              : `No ${activeFilter.toLowerCase()} orders`}
          </p>
          <Link
            href="/home"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const status =
              statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-neutral-400" />
                    <div>
                      <p className="font-medium text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-neutral-500">
                        {new Date(order.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-neutral-500">
                        {order.items.map((item) => item.name).join(', ')}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.total}</p>
                      {order.status === 'delivered' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            // Reorder logic
                          }}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Reorder
                        </button>
                      )}
                      {order.status === 'in_transit' && (
                        <Link
                          href={`/orders/${order.id}/tracking`}
                          className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Truck className="w-3 h-3" />
                          Track
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
