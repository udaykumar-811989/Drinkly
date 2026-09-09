'use client';

import { useState } from 'react';

interface Report {
  id: string;
  name: string;
  type: 'revenue' | 'orders' | 'customers' | 'retailers' | 'delivery' | 'compliance';
  description: string;
  lastGenerated: string;
  frequency: string;
}

const reports: Report[] = [
  { id: 'RPT-001', name: 'Revenue Report', type: 'revenue', description: 'Daily, weekly, and monthly revenue breakdown', lastGenerated: '2026-09-09', frequency: 'Daily' },
  { id: 'RPT-002', name: 'Order Report', type: 'orders', description: 'Complete order analytics and trends', lastGenerated: '2026-09-09', frequency: 'Daily' },
  { id: 'RPT-003', name: 'Customer Growth Report', type: 'customers', description: 'New customer registrations and retention', lastGenerated: '2026-09-08', frequency: 'Weekly' },
  { id: 'RPT-004', name: 'Retailer Performance', type: 'retailers', description: 'Retailer ratings, orders, and revenue', lastGenerated: '2026-09-08', frequency: 'Weekly' },
  { id: 'RPT-005', name: 'Delivery Performance', type: 'delivery', description: 'Agent performance and delivery metrics', lastGenerated: '2026-09-09', frequency: 'Daily' },
  { id: 'RPT-006', name: 'Compliance Report', type: 'compliance', description: 'Compliance violations and audit trail', lastGenerated: '2026-09-07', frequency: 'Monthly' },
];

const reportTypeIcons: Record<string, string> = {
  revenue: '💰',
  orders: '📦',
  customers: '👥',
  retailers: '🏪',
  delivery: '🚚',
  compliance: '⚖️',
};

const reportTypeColors: Record<string, string> = {
  revenue: 'bg-green-500/20 text-green-400',
  orders: 'bg-blue-500/20 text-blue-400',
  customers: 'bg-purple-500/20 text-purple-400',
  retailers: 'bg-amber-500/20 text-amber-400',
  delivery: 'bg-cyan-500/20 text-cyan-400',
  compliance: 'bg-red-500/20 text-red-400',
};

export default function ReportsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filtered = reports.filter(r => typeFilter === 'ALL' || r.type === typeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Reports</h2>
          <p className="text-gray-400 text-sm mt-1">Generate and export platform reports</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
          <option value="ALL">All Report Types</option>
          <option value="revenue">Revenue</option>
          <option value="orders">Orders</option>
          <option value="customers">Customers</option>
          <option value="retailers">Retailers</option>
          <option value="delivery">Delivery</option>
          <option value="compliance">Compliance</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(report => (
          <div key={report.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-12 h-12 ${reportTypeColors[report.type]} rounded-xl flex items-center justify-center text-2xl`}>
                {reportTypeIcons[report.type]}
              </div>
              <span className="text-gray-500 text-xs">{report.frequency}</span>
            </div>
            <h3 className="text-white font-semibold text-lg">{report.name}</h3>
            <p className="text-gray-400 text-sm mt-1">{report.description}</p>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700/50">
              <span className="text-gray-500 text-xs">Last: {report.lastGenerated}</span>
              <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 rounded-lg text-xs font-medium transition-colors">
                Generate & Export
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-4">Quick Stats Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">$245,670</p>
            <p className="text-gray-400 text-sm mt-1">Total Revenue (MTD)</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">8,470</p>
            <p className="text-gray-400 text-sm mt-1">Total Orders (MTD)</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-400">1,245</p>
            <p className="text-gray-400 text-sm mt-1">New Customers (MTD)</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">4.6</p>
            <p className="text-gray-400 text-sm mt-1">Avg. Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
}
