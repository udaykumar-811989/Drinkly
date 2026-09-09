'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const stats = [
  { label: "Today's Orders", value: '24', change: '+12%', up: true, color: 'from-purple-500 to-indigo-600', icon: '📦' },
  { label: 'Revenue Today', value: '£3,847', change: '+8.5%', up: true, color: 'from-emerald-500 to-teal-600', icon: '💷' },
  { label: 'Pending Orders', value: '7', change: '+2', up: false, color: 'from-amber-500 to-orange-600', icon: '⏳' },
  { label: 'Active Orders', value: '12', change: '-3', up: false, color: 'from-blue-500 to-cyan-600', icon: '🚀' },
];

const recentOrders = [
  { id: '#1247', customer: 'James Wilson', items: 3, total: '£89.97', status: 'pending', time: '2 min ago' },
  { id: '#1246', customer: 'Sarah Mitchell', items: 5, total: '£145.50', status: 'preparing', time: '8 min ago' },
  { id: '#1245', customer: 'Michael Brown', items: 2, total: '£52.00', status: 'ready', time: '15 min ago' },
  { id: '#1244', customer: 'Emily Davis', items: 4, total: '£112.25', status: 'completed', time: '22 min ago' },
  { id: '#1243', customer: 'David Johnson', items: 1, total: '£35.00', status: 'completed', time: '30 min ago' },
];

const lowStock = [
  { name: 'Jameson Irish Whiskey', stock: 3, min: 10 },
  { name: 'Jack Daniel\'s Tennessee', stock: 5, min: 15 },
  { name: 'Grey Goose Vodka', stock: 2, min: 8 },
  { name: 'Moët & Chandon', stock: 1, min: 5 },
];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function RetailerDashboard() {
  const [licenceExpiry] = useState(28);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back, John. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/retailer/orders" className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            View Orders
          </Link>
          <Link href="/retailer/products" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
            Manage Products
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white text-lg shadow-sm`}>
                {s.icon}
              </div>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <span className={`text-xs font-semibold ${s.up ? 'text-emerald-600' : 'text-gray-500'}`}>{s.change}</span>
              <span className="text-xs text-gray-400">vs yesterday</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/retailer/orders" className="text-sm text-purple-600 hover:text-purple-700 font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order) => (
              <div key={order.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {order.customer.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                    <p className="text-xs text-gray-500">{order.id} &middot; {order.items} items &middot; {order.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-900">{order.total}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColors[order.status]}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Low Stock Alerts</h2>
            <div className="space-y-3">
              {lowStock.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-red-600">{item.stock} remaining (min: {item.min})</p>
                  </div>
                  <Link href="/retailer/inventory" className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                    Restock
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Licence Status</h2>
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-700">Active</p>
                <p className="text-xs text-emerald-600">Expires in {licenceExpiry} days</p>
              </div>
            </div>
            <div className="mt-3 bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Licence #LIC-2024-0847</span>
                <span>{licenceExpiry}/365 days</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${((365 - licenceExpiry) / 365) * 100}%` }} />
              </div>
            </div>
            <Link href="/retailer/licence" className="mt-3 block text-center text-sm text-purple-600 hover:text-purple-700 font-medium">
              Manage Licence
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Daily Revenue</h2>
          <div className="h-48 flex items-end gap-2 px-2">
            {[65, 45, 80, 55, 70, 90, 60].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full rounded-t-lg transition-all hover:opacity-80 ${i === 6 ? 'bg-gradient-to-t from-purple-600 to-indigo-500' : 'bg-gradient-to-t from-gray-200 to-gray-100'}`} style={{ height: `${h}%` }} />
                <span className="text-[10px] text-gray-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Order Trends</h2>
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
              </div>
              <p className="text-sm text-gray-500">Charts will load with real data</p>
              <p className="text-xs text-gray-400 mt-1">Integrate with analytics API</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
