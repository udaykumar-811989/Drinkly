'use client';

import { useState } from 'react';
import Link from 'next/link';

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

interface ComplianceAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  entity: string;
  time: string;
}

interface ExpiringLicence {
  id: string;
  retailerName: string;
  licenceType: string;
  expiryDate: string;
  daysLeft: number;
}

interface SuspendedAccount {
  id: string;
  name: string;
  type: 'customer' | 'retailer' | 'agent';
  reason: string;
  suspendedAt: string;
}

interface Activity {
  id: string;
  action: string;
  actor: string;
  target: string;
  time: string;
  type: string;
}

const stats: StatCard[] = [
  { label: 'Total Customers', value: '12,847', change: '+12.5%', changeType: 'up', icon: '👥', color: 'bg-blue-500' },
  { label: 'Active Retailers', value: '234', change: '+5.2%', changeType: 'up', icon: '🏪', color: 'bg-emerald-500' },
  { label: 'Pending Approvals', value: '18', change: '+3', changeType: 'up', icon: '⏳', color: 'bg-amber-500' },
  { label: 'Active Agents', value: '156', change: '+8.1%', changeType: 'up', icon: '🚚', color: 'bg-purple-500' },
  { label: 'Today\'s Orders', value: '847', change: '+15.3%', changeType: 'up', icon: '📦', color: 'bg-cyan-500' },
  { label: 'Today\'s Revenue', value: '$24,567', change: '+9.7%', changeType: 'up', icon: '💰', color: 'bg-green-500' },
  { label: 'Failed Orders', value: '12', change: '-23%', changeType: 'down', icon: '❌', color: 'bg-red-500' },
];

const complianceAlerts: ComplianceAlert[] = [
  { id: '1', type: 'critical', message: 'Licence expired for Metro Wine Shop', entity: 'Retailer #RT-1234', time: '1h ago' },
  { id: '2', type: 'warning', message: 'Delivery attempted outside allowed hours', entity: 'Agent #AG-567', time: '3h ago' },
  { id: '3', type: 'warning', message: 'Age verification failed - order blocked', entity: 'Order #ORD-9876', time: '5h ago' },
  { id: '4', type: 'info', message: 'Dry day approaching in Maharashtra', entity: 'System', time: '1d ago' },
  { id: '5', type: 'critical', message: 'Multiple failed login attempts detected', entity: 'User #USR-432', time: '6h ago' },
];

const expiringLicences: ExpiringLicence[] = [
  { id: '1', retailerName: 'City Spirits', licenceType: 'Retail Liquor', expiryDate: '2026-09-16', daysLeft: 7 },
  { id: '2', retailerName: 'Wine Palace', licenceType: 'Wine Shop', expiryDate: '2026-09-20', daysLeft: 11 },
  { id: '3', retailerName: 'Premium Spirits', licenceType: 'Liquor Store', expiryDate: '2026-09-23', daysLeft: 14 },
  { id: '4', retailerName: 'Beer Barn', licenceType: 'Beer & Wine', expiryDate: '2026-09-25', daysLeft: 16 },
];

const suspendedAccounts: SuspendedAccount[] = [
  { id: '1', name: 'Quick Liquors', type: 'retailer', reason: 'Expired licence', suspendedAt: '2026-09-08' },
  { id: '2', name: 'John Smith', type: 'customer', reason: 'Multiple failed age verifications', suspendedAt: '2026-09-07' },
  { id: '3', name: 'Rider Express', type: 'agent', reason: 'Customer complaints', suspendedAt: '2026-09-06' },
];

const recentActivity: Activity[] = [
  { id: '1', action: 'Approved retailer', actor: 'Admin Priya', target: 'New Wine Shop #RT-1289', time: '10m ago', type: 'approval' },
  { id: '2', action: 'Processed refund', actor: 'System', target: 'Order #ORD-7845 - $45.00', time: '25m ago', type: 'refund' },
  { id: '3', action: 'Suspended agent', actor: 'Admin Raj', target: 'Agent #AG-234', time: '1h ago', type: 'suspension' },
  { id: '4', action: 'New licence uploaded', actor: 'Retailer #RT-1100', target: 'LIC-2026-4567', time: '2h ago', type: 'upload' },
  { id: '5', action: 'Compliance rule updated', actor: 'Admin System', target: 'Delivery hours rule', time: '3h ago', type: 'update' },
  { id: '6', action: 'Bulk product approved', actor: 'Admin Priya', target: '25 products from #RT-1050', time: '4h ago', type: 'approval' },
];

const quickLinks = [
  { label: 'Pending Retailers', href: '/admin/retailers?status=PENDING', count: 18, icon: '🏪' },
  { label: 'Pending Licences', href: '/admin/licences?status=PENDING', count: 12, icon: '📋' },
  { label: 'Pending Refunds', href: '/admin/refunds?status=PENDING', count: 7, icon: '↩️' },
  { label: 'Compliance Alerts', href: '/admin/compliance', count: 5, icon: '⚖️' },
  { label: 'Verify Agents', href: '/admin/delivery-agents?status=PENDING', count: 9, icon: '🚚' },
  { label: 'Reports', href: '/admin/reports', count: 0, icon: '📈' },
];

export default function AdminDashboard() {
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
          {(['today', 'week', 'month'] as const).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize
                ${period === p ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-colors">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center text-lg`}>
                {stat.icon}
              </div>
              <span className={`text-sm font-medium ${stat.changeType === 'up' ? 'text-green-400' : stat.changeType === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Orders & Revenue Trend</h3>
          <div className="h-64 bg-gray-900/50 rounded-lg flex items-center justify-center border border-gray-700/30">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-400 text-sm">Chart placeholder</p>
              <p className="text-gray-500 text-xs mt-1">Orders and revenue trends will appear here</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {quickLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center justify-between p-3 bg-gray-700/30 hover:bg-gray-700/60 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{link.icon}</span>
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{link.label}</span>
                </div>
                {link.count > 0 && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full">
                    {link.count}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Compliance Alerts</h3>
            <Link href="/admin/compliance" className="text-emerald-400 text-sm hover:text-emerald-300">View All</Link>
          </div>
          <div className="space-y-3">
            {complianceAlerts.map(alert => (
              <div key={alert.id} className={`p-3 rounded-lg border ${
                alert.type === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                alert.type === 'warning' ? 'bg-amber-500/10 border-amber-500/30' :
                'bg-blue-500/10 border-blue-500/30'
              }`}>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">
                    {alert.type === 'critical' ? '🔴' : alert.type === 'warning' ? '🟡' : '🔵'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 text-xs">{alert.entity}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-500 text-xs">{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Expiring Licences</h3>
            <Link href="/admin/licences" className="text-emerald-400 text-sm hover:text-emerald-300">View All</Link>
          </div>
          <div className="space-y-3">
            {expiringLicences.map(licence => (
              <div key={licence.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white text-sm font-medium">{licence.retailerName}</p>
                  <p className="text-gray-400 text-xs">{licence.licenceType}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-semibold ${licence.daysLeft <= 7 ? 'text-red-400' : licence.daysLeft <= 14 ? 'text-amber-400' : 'text-green-400'}`}>
                    {licence.daysLeft} days
                  </p>
                  <p className="text-gray-500 text-xs">Expires {licence.expiryDate}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Suspended Accounts</h3>
            <Link href="/admin/customers" className="text-emerald-400 text-sm hover:text-emerald-300">Manage</Link>
          </div>
          <div className="space-y-3">
            {suspendedAccounts.map(account => (
              <div key={account.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    account.type === 'retailer' ? 'bg-purple-500/20 text-purple-400' :
                    account.type === 'agent' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {account.type === 'retailer' ? '🏪' : account.type === 'agent' ? '🚚' : '👤'}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{account.name}</p>
                    <p className="text-gray-400 text-xs">{account.reason}</p>
                  </div>
                </div>
                <span className="text-gray-500 text-xs">{account.suspendedAt}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            <Link href="/admin/audit-logs" className="text-emerald-400 text-sm hover:text-emerald-300">View All</Link>
          </div>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-700/30 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                  activity.type === 'approval' ? 'bg-green-500/20 text-green-400' :
                  activity.type === 'refund' ? 'bg-amber-500/20 text-amber-400' :
                  activity.type === 'suspension' ? 'bg-red-500/20 text-red-400' :
                  activity.type === 'upload' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-gray-500/20 text-gray-400'
                }`}>
                  {activity.type === 'approval' ? '✓' : activity.type === 'refund' ? '↩' : activity.type === 'suspension' ? '!' : activity.type === 'upload' ? '↑' : '•'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm">
                    <span className="text-gray-400">{activity.actor}</span> {activity.action}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{activity.target}</p>
                </div>
                <span className="text-gray-500 text-xs flex-shrink-0">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
