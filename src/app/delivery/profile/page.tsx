'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ProfileData {
  name: string
  email: string
  phone: string
  avatar: string
  rating: number
  totalDeliveries: number
  joinDate: string
  vehicle: {
    type: string
    make: string
    model: string
    year: number
    licensePlate: string
  }
  documents: {
    drivingLicence: { status: string; expiry: string }
    idDocument: { status: string; expiry: string }
    vehicleRegistration: { status: string; expiry: string }
  }
  availability: string
}

export default function ProfilePage() {
  const [profile] = useState<ProfileData>({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    phone: '+1 (555) 123-4567',
    avatar: '👤',
    rating: 4.9,
    totalDeliveries: 847,
    joinDate: 'March 2024',
    vehicle: {
      type: 'Car',
      make: 'Toyota',
      model: 'Corolla',
      year: 2022,
      licensePlate: 'ABC 1234',
    },
    documents: {
      drivingLicence: { status: 'verified', expiry: 'Dec 2027' },
      idDocument: { status: 'verified', expiry: 'Mar 2028' },
      vehicleRegistration: { status: 'verified', expiry: 'Jan 2027' },
    },
    availability: 'online',
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto">
          <span className="text-5xl">{profile.avatar}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4">{profile.name}</h1>
        <p className="text-gray-500">{profile.email}</p>
        <p className="text-gray-500">{profile.phone}</p>
        
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-500">{profile.rating}</p>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{profile.totalDeliveries}</p>
            <p className="text-sm text-gray-500">Deliveries</p>
          </div>
          <div className="w-px h-10 bg-gray-200"></div>
          <div className="text-center">
            <p className="text-sm font-bold text-gray-900">{profile.joinDate}</p>
            <p className="text-sm text-gray-500">Joined</p>
          </div>
        </div>
      </div>

      {/* Availability Status */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              profile.availability === 'online' ? 'bg-green-500' : 'bg-gray-400'
            }`}></div>
            <span className="font-medium text-gray-900">
              {profile.availability === 'online' ? 'Currently Online' : 'Currently Offline'}
            </span>
          </div>
          <Link href="/delivery/settings" className="text-purple-600 text-sm font-medium">
            Change
          </Link>
        </div>
      </div>

      {/* Vehicle Information */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Vehicle Information</h3>
          <Link href="/delivery/settings" className="text-purple-600 text-sm font-medium">
            Edit
          </Link>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Type</span>
            <span className="font-medium text-gray-900">{profile.vehicle.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Make & Model</span>
            <span className="font-medium text-gray-900">
              {profile.vehicle.year} {profile.vehicle.make} {profile.vehicle.model}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">License Plate</span>
            <span className="font-medium text-gray-900">{profile.vehicle.licensePlate}</span>
          </div>
        </div>
      </div>

      {/* Documents Status */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Documents</h3>
          <Link href="/delivery/settings" className="text-purple-600 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="space-y-3">
          {Object.entries(profile.documents).map(([key, doc]) => (
            <div key={key} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="text-sm text-gray-500">Expires: {doc.expiry}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Performance Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-green-600">98%</p>
            <p className="text-sm text-green-700">On-Time Rate</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">4.9</p>
            <p className="text-sm text-blue-700">Avg Rating</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-purple-600">847</p>
            <p className="text-sm text-purple-700">Total Deliveries</p>
          </div>
          <div className="bg-yellow-50 rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-yellow-600">0</p>
            <p className="text-sm text-yellow-700">Complaints</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pb-4">
        <Link
          href="/delivery/settings"
          className="block w-full bg-purple-600 text-white py-4 rounded-xl font-bold text-center hover:bg-purple-700 transition-colors"
        >
          ⚙️ Edit Profile
        </Link>
        <button className="block w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors">
          📞 Contact Support
        </button>
      </div>
    </div>
  )
}
