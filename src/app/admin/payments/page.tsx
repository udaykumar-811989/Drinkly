'use client';

import { useState } from 'react';

interface Transaction {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  paymentProvider: string;
  createdAt: string;
  completedAt: string;
  refundAmount?: string;
}

const mockTransactions: Transaction[] = [
  { id: 'TXN-10001', orderId: 'ORD-10001', orderNumber: '#DL-78432', customerName: 'Aarav Patel', amount: '$89.50', status: 'SUCCESS', paymentMethod: 'UPI', paymentProvider: 'Razorpay', createdAt: '2026-09-09 10:30', completedAt: '2026-09-09 10:31' },
  { id: 'TXN-10002', orderId: 'ORD-10002', orderNumber: '#DL-78433', customerName: 'Sneha Sharma', amount: '$156.00', status: 'SUCCESS', paymentMethod: 'Credit Card', paymentProvider: 'Stripe', createdAt: '2026-09-09 11:15', completedAt: '2026-09-09 11:16' },
  { id: 'TXN-10003', orderId: 'ORD-10003', orderNumber: '#DL-78434', customerName: 'Rahul Kumar', amount: '$45.00', status: 'REFUNDED', paymentMethod: 'Cash on Delivery', paymentProvider: 'N/A', createdAt: '2026-09-09 09:00', completedAt: '2026-09-09 09:00', refundAmount: '$45.00' },
  { id: 'TXN-10004', orderId: 'ORD-10004', orderNumber: '#DL-78435', customerName: 'Priya Singh', amount: '$234.75', status: 'PENDING', paymentMethod: 'UPI', paymentProvider: 'Razorpay', createdAt: '2026-09-09 12:00', completedAt: '' },
  { id: 'TXN-10005', orderId: 'ORD-10005', orderNumber: '#DL-78436', customerName: 'Vikram Reddy', amount: '$67.25', status: 'SUCCESS', paymentMethod: 'Debit Card', paymentProvider: 'Stripe', createdAt: '2026-09-09 12:30', completedAt: '2026-09-09 12:31' },
  { id: 'TXN-10006', orderId: 'ORD-10006', orderNumber: '#DL-78437', customerName: 'Neha Gupta', amount: '$112.00', status: 'FAILED', paymentMethod: 'UPI', paymentProvider: 'Razorpay', createdAt: '2026-09-09 13:00', completedAt: '' },
  { id: 'TXN-10007', orderId: 'ORD-10007', orderNumber: '#DL-78438', customerName: 'Aditya Joshi', amount: '$78.50', status: 'REFUNDED', paymentMethod: 'Credit Card', paymentProvider: 'Stripe', createdAt: '2026-09-08 16:00', completedAt: '2026-09-08 16:01', refundAmount: '$78.50' },
  { id: 'TXN-10008', orderId: 'ORD-10008', orderNumber: '#DL-78439', customerName: 'Kavya Nair', amount: '$198.00', status: 'SUCCESS', paymentMethod: 'UPI', paymentProvider: 'Razorpay', createdAt: '2026-09-09 08:15', completedAt: '2026-09-09 08:16' },
];

const statusColors: Record<string, string> = {
  SUCCESS: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  FAILED: 'bg-red-500/20 text-red-400 border-red-500/30',
  REFUNDED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function PaymentsPage() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);

  const filtered = transactions.filter(t => {
    const matchesSearch = t.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      t.customerName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = transactions.filter(t => t.status === 'SUCCESS').reduce((sum, t) => sum + parseFloat(t.amount.replace('$', '')), 0);
  const totalRefunded = transactions.filter(t => t.status === 'REFUNDED').reduce((sum, t) => sum + parseFloat(t.refundAmount?.replace('$', '') || '0'), 0);
  const successRate = ((transactions.filter(t => t.status === 'SUCCESS').length / transactions.length) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Payment Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} transactions found</p>
        </div>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          📥 Export
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-400 mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Total Refunded</p>
          <p className="text-2xl font-bold text-cyan-400 mt-1">${totalRefunded.toFixed(2)}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Success Rate</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{successRate}%</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Failed Transactions</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{transactions.filter(t => t.status === 'FAILED').length}</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search by transaction ID, order, or customer..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
          <option value="ALL">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Transaction</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Method</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Provider</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(txn => (
                <tr key={txn.id} className="hover:bg-gray-700/20 transition-colors cursor-pointer" onClick={() => setSelectedTxn(txn)}>
                  <td className="px-5 py-4">
                    <p className="text-white text-sm font-mono">{txn.id}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{txn.orderNumber}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{txn.customerName}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm font-medium">{txn.amount}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[txn.status]}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{txn.paymentMethod}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{txn.paymentProvider}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs text-right">{txn.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTxn && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedTxn(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Transaction Details</h3>
              <button onClick={() => setSelectedTxn(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-lg">{selectedTxn.id}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedTxn.status]}`}>{selectedTxn.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Order</p><p className="text-white text-sm mt-1">{selectedTxn.orderNumber}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Customer</p><p className="text-white text-sm mt-1">{selectedTxn.customerName}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Amount</p><p className="text-emerald-400 text-sm mt-1 font-semibold">{selectedTxn.amount}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Payment Method</p><p className="text-white text-sm mt-1">{selectedTxn.paymentMethod}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Provider</p><p className="text-white text-sm mt-1">{selectedTxn.paymentProvider}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Created</p><p className="text-white text-sm mt-1">{selectedTxn.createdAt}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Completed</p><p className="text-white text-sm mt-1">{selectedTxn.completedAt || 'N/A'}</p></div>
                {selectedTxn.refundAmount && <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Refund Amount</p><p className="text-cyan-400 text-sm mt-1">{selectedTxn.refundAmount}</p></div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
