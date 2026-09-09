'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Truck,
  Phone,
  Star,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  ChevronLeft,
} from 'lucide-react'

const trackingData = {
  orderNumber: 'DL-2024-001234',
  eta: '15 min',
  status: 'in_transit',
  agent: {
    name: 'Rahul K.',
    rating: 4.8,
    phone: '+91 98765 43210',
    vehicle: 'Bike',
  },
  pickup: {
    name: 'Premium Liquors',
    address: '123 Main Street, Downtown',
  },
  dropoff: {
    name: 'Home',
    address: '123 Main Street, Apt 4B, Downtown',
  },
  timeline: [
    {
      status: 'Order Placed',
      time: '2:30 PM',
      completed: true,
    },
    {
      status: 'Order Confirmed',
      time: '2:32 PM',
      completed: true,
    },
    {
      status: 'Picking Up',
      time: '2:45 PM',
      completed: true,
    },
    {
      status: 'On the Way',
      time: '3:00 PM',
      completed: false,
      current: true,
    },
    {
      status: 'Delivered',
      time: '',
      completed: false,
    },
  ],
}

export default function TrackingPage({ params }: { params: { id: string } }) {
  const [currentLocation, setCurrentLocation] = useState({ lat: 19.076, lng: 72.8777 })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation((prev) => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001,
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href={`/orders/1`}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold">Live Tracking</h1>
          <p className="text-sm text-neutral-500">
            {trackingData.orderNumber}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <div className="relative h-80 md:h-[500px] rounded-2xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-800">
            {/* Map placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-2 animate-bounce" />
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Live map view
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  Lat: {currentLocation.lat.toFixed(4)}, Lng: {currentLocation.lng.toFixed(4)}
                </p>
              </div>
            </div>
            {/* ETA Badge */}
            <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-xl shadow-lg">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">
                  ETA: {trackingData.eta}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          {/* Delivery Agent */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Delivery Agent</h2>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl font-bold text-blue-600">
                {trackingData.agent.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium">{trackingData.agent.name}</p>
                <div className="flex items-center gap-1 text-sm text-neutral-500">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {trackingData.agent.rating}
                  <span>•</span>
                  <span>{trackingData.agent.vehicle}</span>
                </div>
              </div>
            </div>
            <a
              href={`tel:${trackingData.agent.phone}`}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Agent
            </a>
          </div>

          {/* Order Status */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Order Status</h2>
            <div className="space-y-4">
              {trackingData.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        event.completed
                          ? 'bg-green-500'
                          : event.current
                          ? 'bg-blue-500 animate-pulse'
                          : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                    />
                    {index < trackingData.timeline.length - 1 && (
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
                    <p
                      className={`font-medium text-sm ${
                        event.current ? 'text-blue-600' : ''
                      }`}
                    >
                      {event.status}
                    </p>
                    {event.time && (
                      <p className="text-xs text-neutral-500">{event.time}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pickup & Dropoff */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="font-semibold mb-4">Route</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-1" />
                <div>
                  <p className="text-sm font-medium">
                    {trackingData.pickup.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {trackingData.pickup.address}
                  </p>
                </div>
              </div>
              <div className="ml-1.5 w-0.5 h-4 bg-neutral-200 dark:bg-neutral-700" />
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
                <div>
                  <p className="text-sm font-medium">
                    {trackingData.dropoff.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {trackingData.dropoff.address}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
