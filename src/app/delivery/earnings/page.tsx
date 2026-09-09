'use client'

import { useState } from 'react'

interface EarningsData {
  thisWeek: number
  thisMonth: number
  allTime: number
  pending: number
  dailyBreakdown: { day: string; amount: number }[]
  feeBreakdown: { type: string; amount: number }[]
  tips: number
  payoutHistory: { date: string; amount: number; status: string }[]
}

export default function EarningsPage() {
  const [activePeriod, setActivePeriod] = useState<'week' | 'month' | 'all'>('week')
  const [earnings] = useState<EarningsData>({
    thisWeek: 287.50,
    thisMonth: 1245.75,
    allTime: 8932.25,
    pending: 45.00,
    dailyBreakdown: [
      { day: 'Mon', amount: 42.50 },
      { day: 'Tue', amount: 38.75 },
      { day: 'Wed', amount: 52.00 },
      { day: 'Thu', amount: 45.25 },
      { day: 'Fri', amount: 65.00 },
      { day: 'Sat', amount: 44.00 },
      { day: 'Sun', amount: 0 },
    ],
    feeBreakdown: [
      { type: 'Base Delivery Fee', amount: 185.00 },
      { type: 'Distance Bonus', amount: 62.50 },
      { type: 'Peak Hour Bonus', amount: 40.00 },
    ],
    tips: 52.75,
    payoutHistory: [
      { date: 'Sep 8, 2026', amount: 245.00, status: 'Paid' },
      { date: 'Sep 1, 2026', amount: 312.50, status: 'Paid' },
      { date: 'Aug 25, 2026', amount: 287.75, status: 'Paid' },
      { date: 'Aug 18, 2026', amount: 395.50, status: 'Paid' },
    ],
  })

  const maxDailyAmount = Math.max(...earnings.dailyBreakdown.map(d => d.amount))

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="bg-white rounded-2xl shadow-sm p-2">
        <div className="grid grid-cols-3 gap-2">
          {(['week', 'month', 'all'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`py-2 px-3 rounded-xl text-sm font-medium transition-colors ${
                activePeriod === period
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {period === 'week' ? 'This Week' : period === 'month' ? 'This Month' : 'All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Earnings Card */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
        <p className="text-white/80">Total Earnings</p>
        <p className="text-4xl font-bold mt-1">
          ${activePeriod === 'week' ? earnings.thisWeek.toFixed(2) : 
            activePeriod === 'month' ? earnings.thisMonth.toFixed(2) : 
            earnings.allTime.toFixed(2)}
        </p>
        {activePeriod === 'week' && (
          <p className="text-sm text-white/70 mt-2">+12% from last week</p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Pending Payout</p>
          <p className="text-2xl font-bold text-yellow-500">${earnings.pending.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Next payout: Tomorrow</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4">
          <p className="text-sm text-gray-500">Tips Today</p>
          <p className="text-2xl font-bold text-green-500">${earnings.tips.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">+5% from yesterday</p>
        </div>
      </div>

      {/* Daily Breakdown Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Daily Breakdown</h3>
        <div className="flex items-end justify-between h-40 space-x-2">
          {earnings.dailyBreakdown.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center">
                <span className="text-xs text-gray-500 mb-1">${day.amount.toFixed(0)}</span>
                <div
                  className="w-full bg-gradient-to-t from-purple-500 to-pink-500 rounded-t-lg transition-all"
                  style={{ 
                    height: `${maxDailyAmount > 0 ? (day.amount / maxDailyAmount) * 100 : 0}%`,
                    minHeight: day.amount > 0 ? '4px' : '0px'
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500 mt-2">{day.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Earnings Breakdown</h3>
        <div className="space-y-3">
          {earnings.feeBreakdown.map((fee, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="text-gray-700">{fee.type}</span>
              </div>
              <span className="font-medium">${fee.amount.toFixed(2)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Tips</span>
            </div>
            <span className="font-medium text-green-600">${earnings.tips.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-blue-50 rounded-2xl p-4">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">📅</span>
          <div>
            <h4 className="font-bold text-blue-900">Payment Schedule</h4>
            <p className="text-sm text-blue-700 mt-1">
              Payouts are processed every Tuesday and Friday. Direct deposit typically arrives within 1-2 business days.
            </p>
          </div>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="font-bold text-gray-900 mb-4">Payout History</h3>
        <div className="space-y-3">
          {earnings.payoutHistory.map((payout, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-gray-900">{payout.date}</p>
                <p className="text-sm text-gray-500">Direct Deposit</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${payout.amount.toFixed(2)}</p>
                <span className="text-xs text-green-600">{payout.status}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-purple-600 font-medium hover:bg-purple-50 rounded-xl transition-colors">
          View All Payouts
        </button>
      </div>
    </div>
  )
}
