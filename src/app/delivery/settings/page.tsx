'use client'

import { useState } from 'react'
import Link from 'next/link'

interface SettingsData {
  notifications: {
    newOrders: boolean
    orderUpdates: boolean
    earningsUpdates: boolean
    promotions: boolean
    soundEnabled: boolean
  }
  deliveryPreferences: {
    maxDistance: number
    preferredAreas: string[]
    autoAccept: boolean
    avoidHighways: boolean
  }
  vehicle: {
    type: string
    make: string
    model: string
    year: number
    licensePlate: string
  }
  payout: {
    method: string
    bankName: string
    lastFour: string
  }
  accountStatus: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      newOrders: true,
      orderUpdates: true,
      earningsUpdates: true,
      promotions: false,
      soundEnabled: true,
    },
    deliveryPreferences: {
      maxDistance: 15,
      preferredAreas: ['Downtown', 'Uptown'],
      autoAccept: false,
      avoidHighways: false,
    },
    vehicle: {
      type: 'Car',
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      licensePlate: 'ABC 1234',
    },
    payout: {
      method: 'Bank Transfer',
      bankName: 'Chase Bank',
      lastFour: '4567',
    },
    accountStatus: 'Active',
  })

  const toggleNotification = (key: keyof typeof settings.notifications) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key],
      },
    }))
  }

  const togglePreference = (key: keyof typeof settings.deliveryPreferences) => {
    setSettings(prev => ({
      ...prev,
      deliveryPreferences: {
        ...prev.deliveryPreferences,
        [key]: !prev.deliveryPreferences[key],
      },
    }))
  }

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? 'bg-purple-600' : 'bg-gray-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/delivery/profile" className="text-purple-600 font-medium">
          ← Back
        </Link>
        <h1 className="text-lg font-bold text-gray-900">Settings</h1>
        <div className="w-16"></div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">New Orders</p>
              <p className="text-sm text-gray-500">Get notified of new delivery requests</p>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.newOrders}
              onToggle={() => toggleNotification('newOrders')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Order Updates</p>
              <p className="text-sm text-gray-500">Status changes and customer messages</p>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.orderUpdates}
              onToggle={() => toggleNotification('orderUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Earnings Updates</p>
              <p className="text-sm text-gray-500">Payout confirmations and summaries</p>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.earningsUpdates}
              onToggle={() => toggleNotification('earningsUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Promotions</p>
              <p className="text-sm text-gray-500">Bonus offers and incentives</p>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.promotions}
              onToggle={() => toggleNotification('promotions')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Sound Alerts</p>
              <p className="text-sm text-gray-500">Play sound for incoming orders</p>
            </div>
            <ToggleSwitch
              enabled={settings.notifications.soundEnabled}
              onToggle={() => toggleNotification('soundEnabled')}
            />
          </div>
        </div>
      </div>

      {/* Delivery Preferences */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Delivery Preferences</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-900">Max Delivery Distance</p>
              <span className="text-purple-600 font-bold">{settings.deliveryPreferences.maxDistance} km</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={settings.deliveryPreferences.maxDistance}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                deliveryPreferences: {
                  ...prev.deliveryPreferences,
                  maxDistance: parseInt(e.target.value),
                },
              }))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>5 km</span>
              <span>50 km</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Auto-Accept Orders</p>
              <p className="text-sm text-gray-500">Automatically accept nearby orders</p>
            </div>
            <ToggleSwitch
              enabled={settings.deliveryPreferences.autoAccept}
              onToggle={() => togglePreference('autoAccept')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Avoid Highways</p>
              <p className="text-sm text-gray-500">Use alternative routes</p>
            </div>
            <ToggleSwitch
              enabled={settings.deliveryPreferences.avoidHighways}
              onToggle={() => togglePreference('avoidHighways')}
            />
          </div>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Vehicle Information</h3>
          <button className="text-purple-600 text-sm font-medium">Edit</button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-medium text-gray-900">{settings.vehicle.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vehicle</span>
            <span className="font-medium text-gray-900">
              {settings.vehicle.year} {settings.vehicle.make} {settings.vehicle.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">License Plate</span>
            <span className="font-medium text-gray-900">{settings.vehicle.licensePlate}</span>
          </div>
        </div>
      </div>

      {/* Payout Details */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Payout Details</h3>
          <button className="text-purple-600 text-sm font-medium">Update</button>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Method</span>
            <span className="font-medium text-gray-900">{settings.payout.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Bank</span>
            <span className="font-medium text-gray-900">{settings.payout.bankName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Account</span>
            <span className="font-medium text-gray-900">••••{settings.payout.lastFour}</span>
          </div>
        </div>
        <div className="mt-4 bg-yellow-50 rounded-xl p-3">
          <p className="text-sm text-yellow-800">
            🔒 Your payment information is encrypted and secure.
          </p>
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Account</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Status</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              {settings.accountStatus}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Member Since</span>
            <span className="font-medium text-gray-900">March 2024</span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-2xl shadow-sm p-4 border border-red-200">
        <h3 className="font-bold text-red-600 mb-4">Account Actions</h3>
        <div className="space-y-3">
          <button className="w-full py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
            📄 Download My Data
          </button>
          <button className="w-full py-3 text-left text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
            ❓ Help & Support
          </button>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('userRole')
                window.location.href = '/login'
              }
            }}
            className="w-full py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            🚪 Log Out
          </button>
        </div>
      </div>

      <div className="pb-4"></div>
    </div>
  )
}
