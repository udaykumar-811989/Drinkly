'use client';

import { useState } from 'react';

interface Refund {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PROCESSED';
  requestedAt: string;
  processedAt: string;
  processedBy: string;
  paymentMethod: string;
}

const mockRefunds: Refund[] = [
  { id: 'REF-1001', orderId: 'ORD-10003', orderNumber: '#DL-78434', customerName: 'Rahul Kumar', amount: '$45.00', reason: 'Order cancelled by customer before delivery', status: 'PROCESSED', requestedAt: '2026-09-09 09:15', processedAt: '2026-09-09 09:30', processedBy: 'System Auto', paymentMethod: 'Cash on Delivery' },
  { id: 'REF-1002', orderId: 'ORD-10007', orderNumber: '#DL-78438', customerName: 'Aditya Joshi', amount: '$78.50', reason: 'Wrong product delivered', status: 'PROCESSED', requestedAt: '2026-09-08 16:30', processedAt: '2026-09-08 17:00', processedBy: 'Admin Priya', paymentMethod: 'Credit Card' },
  { id: 'REF-1003', orderId: 'ORD-10010', orderNumber: '#DL-78441', customerName: 'Vikram Reddy', amount: '$32.00', reason: 'Damaged bottle on delivery', status: 'PENDING', requestedAt: '2026-09-09 14:00', processedAt: '', processedBy: '', paymentMethod: 'UPI' },
  { id: 'REF-1004', orderId: 'ORD-10011', orderNumber: '#DL-78442', customerName: 'Neha Gupta', amount: '$156.00', reason: 'Customer not available, order returned', status: 'PENDING', requestedAt: '2026-09-09 14:30', processedAt: '', processedBy: '', paymentMethod: 'Credit Card' },
  { id: 'REF-1005', orderId: 'ORD-10012', orderNumber: '#DL-78443', customerName: 'Aarav Patel', amount: '$89.50', reason: 'Quality issue with products', status: 'APPROVED', requestedAt: '2026-09-09 11:00', processedAt: '2026-09-09 12:00', processedBy: 'Admin Raj', paymentMethod: 'UPI' },
  { id: 'REF-1006', orderId: 'ORD-10013', orderNumber: '#DL-78444', customerName: 'Sneha Sharma', amount: '$23.00', reason: 'Partial order missing items', status: 'REJECTED', requestedAt: '2026-09-08 10:00', processedAt: '2026-09-08 11:00', processedBy: 'Admin Priya', paymentMethod: 'Debit Card' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  APPROVED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  REJECTED: 'bg-red-500/20 text-red-400 border-red-500/30',
  PROCESSED: 'bg-green-500/20 text-green-400 border-green-500/30',
};

export default function RefundsPage() {
  const [refunds, setRefunds] = useState(mockRefunds);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'process'>('approve');

  const filtered = refunds.filter(r => {
    const matchesSearch = r.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = refunds.filter(r => r.status === 'PENDING').length;
  const totalPendingAmount = refunds.filter(r => r.status === 'PENDING').reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '')), 0);
  const totalProcessedAmount = refunds.filter(r => r.status === 'PROCESSED').reduce((sum, r) => sum + parseFloat(r.amount.replace('$', '')), 0);

  const handleAction = (refundId: string) => {
    const now = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5);
    setRefunds(prev => prev.map(r =>
      r.id === refundId ? {
        ...r,
        status: actionType === 'approve' ? 'APPROVED' : actionType === 'reject' ? 'REJECTED' : 'PROCESSED',
        processedAt: now,
        processedBy: 'Admin User',
      } : r
    ));
    setShowActionModal(false);
    setSelectedRefund(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Refund Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} refunds • {pendingCount} pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Pending Refunds</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">${totalPendingAmount.toFixed(2)}</p>
          <p className="text-gray-500 text-xs mt-1">{pendingCount} requests</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Processed Refunds</p>
          <p className="text-2xl font-bold text-green-400 mt-1">${totalProcessedAmount.toFixed(2)}</p>
          <p className="text-gray-500 text-xs mt-1">{refunds.filter(r => r.status === 'PROCESSED').length} refunds</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5">
          <p className="text-gray-400 text-sm">Rejected Refunds</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{refunds.filter(r => r.status === 'REJECTED').length}</p>
          <p className="text-gray-500 text-xs mt-1">requests denied</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search refunds..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="PROCESSED">Processed</option>
        </select>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Refund ID</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Amount</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Reason</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(refund => (
                <tr key={refund.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-5 py-4 text-white text-sm font-mono">{refund.id}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{refund.orderNumber}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{refund.customerName}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm font-medium">{refund.amount}</td>
                  <td className="px-5 py-4 text-gray-400 text-xs max-w-xs truncate">{refund.reason}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[refund.status]}`}>
                      {refund.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setSelectedRefund(refund)} className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors">View</button>
                      {refund.status === 'PENDING' && (
                        <>
                          <button onClick={() => { setSelectedRefund(refund); setActionType('process'); setShowActionModal(true); }} className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors">Process</button>
                          <button onClick={() => { setSelectedRefund(refund); setActionType('reject'); setShowActionModal(true); }} className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors">Reject</button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedRefund && !showActionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRefund(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Refund Details</h3>
              <button onClick={() => setSelectedRefund(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-white font-mono text-lg">{selectedRefund.id}</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedRefund.status]}`}>{selectedRefund.status}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Order</p><p className="text-white text-sm mt-1">{selectedRefund.orderNumber}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Customer</p><p className="text-white text-sm mt-1">{selectedRefund.customerName}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Amount</p><p className="text-emerald-400 text-sm mt-1 font-semibold">{selectedRefund.amount}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Payment Method</p><p className="text-white text-sm mt-1">{selectedRefund.paymentMethod}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3 col-span-2"><p className="text-gray-400 text-xs">Reason</p><p className="text-white text-sm mt-1">{selectedRefund.reason}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Requested At</p><p className="text-white text-sm mt-1">{selectedRefund.requestedAt}</p></div>
                <div className="bg-gray-700/30 rounded-lg p-3"><p className="text-gray-400 text-xs">Processed At</p><p className="text-white text-sm mt-1">{selectedRefund.processedAt || 'N/A'}</p></div>
              </div>
              {selectedRefund.status === 'PENDING' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setActionType('process'); setShowActionModal(true); }} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">Process Refund</button>
                  <button onClick={() => { setActionType('reject'); setShowActionModal(true); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Reject Refund</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedRefund && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowActionModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">{actionType === 'process' ? 'Process Refund' : 'Reject Refund'}</h3>
            <p className="text-gray-400 text-sm mb-6">
              {actionType === 'process'
                ? `Process refund of ${selectedRefund.amount} for ${selectedRefund.customerName}?`
                : `Reject refund request of ${selectedRefund.amount} from ${selectedRefund.customerName}?`
              }
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowActionModal(false)} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => handleAction(selectedRefund.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${actionType === 'process' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                {actionType === 'process' ? 'Process' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
