'use client';

import React, { useState } from 'react';

const revenueData = {
  daily: [
    { day: 'Mon', value: 1250 },
    { day: 'Tue', value: 980 },
    { day: 'Wed', value: 1420 },
    { day: 'Thu', value: 1100 },
    { day: 'Fri', value: 1680 },
    { day: 'Sat', value: 2100 },
    { day: 'Sun', value: 1540 },
  ],
  weekly: [
    { day: 'W1', value: 8500 },
    { day: 'W2', value: 9200 },
    { day: 'W3', value: 7800 },
    { day: 'W4', value: 10100 },
  ],
  monthly: [
    { day: 'Jan', value: 35000 },
    { day: 'Feb', value: 32000 },
    { day: 'Mar', value: 38000 },
    { day: 'Apr', value: 41000 },
    { day: 'May', value: 39000 },
    { day: 'Jun', value: 45000 },
  ],
};

const orderData = {
  daily: [12, 8, 15, 11, 18, 24, 16],
  weekly: [65, 72, 58, 80],
  monthly: [280, 310, 295, 340, 320, 365],
};

const topProducts = [
  { name: 'Jameson Irish Whiskey', sold: 145, revenue: 5075, growth: 12 },
  { name: 'Grey Goose Vodka', sold: 98, revenue: 4116, growth: 8 },
  { name: 'Moët & Chandon', sold: 72, revenue: 3240, growth: -3 },
  { name: 'Jack Daniel\'s', sold: 132, revenue: 3696, growth: 15 },
  { name: 'Hendricks Gin', sold: 87, revenue: 2784, growth: 5 },
];

const customerSatisfaction = [
  { rating: 5, count: 156, percentage: 52 },
  { rating: 4, count: 89, percentage: 30 },
  { rating: 3, count: 36, percentage: 12 },
  { rating: 2, count: 12, percentage: 4 },
  { rating: 1, count: 6, percentage: 2 },
];

const deliveryStats = [
  { label: 'Avg Delivery Time', value: '28 min', icon: '⏱️' },
  { label: 'On-Time Rate', value: '94.2%', icon: '✅' },
  { label: 'Avg Distance', value: '3.2 km', icon: '📍' },
  { label: 'Failed Deliveries', value: '1.8%', icon: '❌' },
];

export default function RetailerAnalytics() {
  const [revenuePeriod, setRevenuePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [orderPeriod, setOrderPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const maxRevenue = Math.max(...revenueData[revenuePeriod]);
  const maxOrders = Math.max(...orderData[orderPeriod]);

  const totalRevenue = revenueData[revenuePeriod].reduce((s, d) => s + d.value, 0);
  const totalOrders = orderData[orderPeriod].reduce((s, d) => s + d, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Track your business performance and insights</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">£{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">💷</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">+12.5% vs last period</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalOrders}</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">📦</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">+8.3% vs last period</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">£{avgOrderValue.toFixed(2)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">📊</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">+3.7% vs last period</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Customer Rating</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">4.6/5.0</p>
            </div>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <span className="text-lg">⭐</span>
            </div>
          </div>
          <p className="text-xs text-emerald-600 mt-2">+0.2 vs last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <button key={p} onClick={() => setRevenuePeriod(p)} className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${revenuePeriod === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end gap-3 px-2">
            {revenueData[revenuePeriod].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">£{d.value.toLocaleString()}</span>
                <div className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(d.value / maxRevenue) * 180}px` }} />
                <span className="text-xs text-gray-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Order Volume</h2>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
              {(['daily', 'weekly', 'monthly'] as const).map((p) => (
                <button key={p} onClick={() => setOrderPeriod(p)} className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${orderPeriod === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-end gap-3 px-2">
            {orderData[orderPeriod].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs font-medium text-gray-600">{val}</span>
                <div className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(val / maxOrders) * 180}px` }} />
                <span className="text-xs text-gray-400">
                  {orderPeriod === 'daily' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : orderPeriod === 'weekly' ? `W${i + 1}` : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-sm font-bold text-purple-600">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.sold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">£{product.revenue.toLocaleString()}</p>
                  <p className={`text-xs font-medium ${product.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                    {product.growth >= 0 ? '+' : ''}{product.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Customer Satisfaction</h2>
          <div className="space-y-3">
            {customerSatisfaction.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-4">{item.rating}★</span>
                <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all" style={{ width: `${item.percentage}%` }} />
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{item.count}</span>
                <span className="text-xs text-gray-400 w-10 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <span className="text-lg">⭐</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">4.6 out of 5.0</p>
                <p className="text-xs text-gray-500">Based on 299 reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Delivery Performance</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {deliveryStats.map((stat, i) => (
            <div key={i} className="p-4 bg-gray-50 rounded-xl text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-xl font-bold text-gray-900 mt-2">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
