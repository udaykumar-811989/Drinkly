'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Check,
  CreditCard,
  Shield,
  ChevronRight,
  ChevronLeft,
  Plus,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from 'lucide-react'

const steps = [
  { id: 1, title: 'Delivery Address' },
  { id: 2, title: 'Order Review' },
  { id: 3, title: 'Compliance' },
  { id: 4, title: 'Payment' },
  { id: 5, title: 'Confirmation' },
]

const addresses = [
  {
    id: 1,
    label: 'Home',
    address: '123 Main Street, Apt 4B, Downtown',
    city: 'Mumbai',
    pincode: '400001',
    isDefault: true,
  },
  {
    id: 2,
    label: 'Office',
    address: '456 Business Park, Tower A, 5th Floor',
    city: 'Mumbai',
    pincode: '400051',
    isDefault: false,
  },
]

const cartItems = [
  {
    id: 1,
    name: 'Johnnie Walker Black Label',
    price: 3500,
    quantity: 1,
    size: '750ml',
  },
  {
    id: 2,
    name: 'Budweiser Beer',
    price: 180,
    quantity: 6,
    size: '330ml',
  },
]

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦' },
  { id: 'wallet', name: 'Digital Wallet', icon: '💰' },
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(1)
  const [selectedPayment, setSelectedPayment] = useState('')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const tax = Math.round(subtotal * 0.18)
  const deliveryFee = 49
  const platformFee = 19
  const total = subtotal + tax + deliveryFee + platformFee

  const handleNext = async () => {
    if (currentStep === 3) {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setLoading(false)
    }
    if (currentStep === 5) {
      setOrderPlaced(true)
      return
    }
    setCurrentStep((prev) => Math.min(5, prev + 1))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1))
  }

  if (orderPlaced) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Order Placed!</h1>
        <p className="text-neutral-500 mb-2">
          Order #DL-2024-001234
        </p>
        <p className="text-neutral-500 mb-8">
          Your order will be delivered in 30-45 minutes
        </p>
        <div className="flex gap-4">
          <Link
            href="/orders/1/tracking"
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Track Order
          </Link>
          <Link
            href="/home"
            className="px-6 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? 'bg-green-500 text-white'
                      : currentStep === step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs mt-2 hidden md:block text-neutral-500">
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-1 w-12 md:w-20 mx-2 ${
                    currentStep > step.id
                      ? 'bg-green-500'
                      : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Delivery Address */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Delivery Address</h2>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedAddress === addr.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{addr.label}</span>
                      {addr.isDefault && (
                        <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500">{addr.address}</p>
                    <p className="text-sm text-neutral-500">
                      {addr.city} - {addr.pincode}
                    </p>
                  </div>
                </label>
              ))}
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm">
                <Plus className="w-4 h-4" />
                Add New Address
              </button>
            </div>
          )}

          {/* Step 2: Order Review */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Review</h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800"
                  >
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-neutral-500">
                        {item.size} × {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Compliance Verification */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Compliance Verification
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Age Verification</p>
                        <p className="text-sm text-neutral-500">
                          Confirm you are of legal drinking age
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={ageConfirmed}
                        onChange={(e) => setAgeConfirmed(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Location Verification</p>
                        <p className="text-sm text-neutral-500">
                          Confirm delivery is in an eligible area
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={locationConfirmed}
                        onChange={(e) => setLocationConfirmed(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                    </label>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div className="text-sm text-amber-700 dark:text-amber-300">
                      <p className="font-medium mb-1">Important Notice</p>
                      <p>
                        Alcohol delivery may not be available in all areas. If
                        your location is not eligible, you will receive a full
                        refund. Age verification will be required at delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Payment Method */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={selectedPayment === method.id}
                      onChange={() => setSelectedPayment(method.id)}
                      className="sr-only"
                    />
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-medium">{method.name}</span>
                    {selectedPayment === method.id && (
                      <Check className="w-5 h-5 text-blue-600 ml-auto" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Order Confirmation */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-lg font-semibold mb-4">
                Confirm Your Order
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-medium mb-2">Delivery Address</p>
                  <p className="text-sm text-neutral-500">
                    {addresses.find((a) => a.id === selectedAddress)?.address}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-medium mb-2">Payment Method</p>
                  <p className="text-sm text-neutral-500">
                    {paymentMethods.find((m) => m.id === selectedPayment)?.name}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                  <p className="text-sm font-medium mb-2">Order Items</p>
                  {cartItems.map((item) => (
                    <p key={item.id} className="text-sm text-neutral-500">
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6">
            <h2 className="text-lg font-bold mb-4">Order Summary</h2>
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
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Platform Fee</span>
                <span>₹{platformFee}</span>
              </div>
            </div>
            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">₹{total}</span>
              </div>
            </div>

            <div className="flex gap-3">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="flex-1 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 font-medium flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={
                  loading ||
                  (currentStep === 3 && (!ageConfirmed || !locationConfirmed))
                }
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : currentStep === 5 ? (
                  'Place Order'
                ) : (
                  <>
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
