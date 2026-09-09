'use client';

import { useState } from 'react';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerId: string;
  retailerName: string;
  retailerId: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  total: string;
  items: number;
  deliveryAddress: string;
  createdAt: string;
  deliveredAt: string;
  agentName: string;
  paymentMethod: string;
}

const mockOrders: Order[] = [
  { id: 'ORD-10001', orderNumber: '#DL-78432', customerName: 'Aarav Patel', customerId: 'C-1001', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', status: 'DELIVERED', total: '$89.50', items: 3, deliveryAddress: '12 MG Road, Mumbai', createdAt: '2026-09-09 10:30', deliveredAt: '2026-09-09 11:45', agentName: 'Ravi Kumar', paymentMethod: 'UPI' },
  { id: 'ORD-10002', orderNumber: '#DL-78433', customerName: 'Sneha Sharma', customerId: 'C-1002', retailerName: 'Wine Palace', retailerId: 'RT-1003', status: 'OUT_FOR_DELIVERY', total: '$156.00', items: 5, deliveryAddress: '45 Park Street, Kolkata', createdAt: '2026-09-09 11:15', deliveredAt: '', agentName: 'Suresh Patel', paymentMethod: 'Credit Card' },
  { id: 'ORD-10003', orderNumber: '#DL-78434', customerName: 'Rahul Kumar', customerId: 'C-1003', retailerName: 'Premium Spirits', retailerId: 'RT-1004', status: 'CANCELLED', total: '$45.00', items: 2, deliveryAddress: '78 Brigade Road, Bangalore', createdAt: '2026-09-09 09:00', deliveredAt: '', agentName: '', paymentMethod: 'Cash on Delivery' },
  { id: 'ORD-10004', orderNumber: '#DL-78435', customerName: 'Priya Singh', customerId: 'C-1004', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', status: 'PROCESSING', total: '$234.75', items: 7, deliveryAddress: '23 Anna Salai, Chennai', createdAt: '2026-09-09 12:00', deliveredAt: '', agentName: '', paymentMethod: 'UPI' },
  { id: 'ORD-10005', orderNumber: '#DL-78436', customerName: 'Vikram Reddy', customerId: 'C-1005', retailerName: 'Liquor Land', retailerId: 'RT-1006', status: 'CONFIRMED', total: '$67.25', items: 2, deliveryAddress: '56 Banjara Hills, Hyderabad', createdAt: '2026-09-09 12:30', deliveredAt: '', agentName: '', paymentMethod: 'Debit Card' },
  { id: 'ORD-10006', orderNumber: '#DL-78437', customerName: 'Neha Gupta', customerId: 'C-1006', retailerName: 'Wine Palace', retailerId: 'RT-1003', status: 'PENDING', total: '$112.00', items: 4, deliveryAddress: '90 Civil Lines, Delhi', createdAt: '2026-09-09 13:00', deliveredAt: '', agentName: '', paymentMethod: 'UPI' },
  { id: 'ORD-10007', orderNumber: '#DL-78438', customerName: 'Aditya Joshi', customerId: 'C-1007', retailerName: 'Beer Barn', retailerId: 'RT-1005', status: 'REFUNDED', total: '$78.50', items: 3, deliveryAddress: '34 FC Road, Pune', createdAt: '2026-09-08 16:00', deliveredAt: '', agentName: 'Deepak Nair', paymentMethod: 'Credit Card' },
  { id: 'ORD-10008', orderNumber: '#DL-78439', customerName: 'Kavya Nair', customerId: 'C-1008', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', status: 'DELIVERED', total: '$198.00', items: 6, deliveryAddress: '67 MG Road, Kochi', createdAt: '2026-09-09 08:15', deliveredAt: '2026-09-09 09:30', agentName: 'Mohammed Ali', paymentMethod: 'UPI' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  CONFIRMED: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PROCESSING: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  OUT_FOR_DELIVERY: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELIVERED: 'bg-green-500/20 text-green-400 border-green-500/30',
  CANCELLED: 'bg-red-500/20 text-red-400 border-red-500/30',
  REFUNDED: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);

  const filtered = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCancel = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'CANCELLED' } : o));
    setShowCancelModal(false);
    setSelectedOrder(null);
  };

  const handleRefund = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'REFUNDED' } : o));
    setShowRefundModal(false);
    setSelectedOrder(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Order Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} orders found</p>
        </div>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          📥 Export CSV
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by order number, customer, or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="PROCESSING">Processing</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <input
          type="date"
          value={dateFrom}
          onChange={e => setDateFrom(e.target.value)}
          placeholder="From"
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        />
        <input
          type="date"
          value={dateTo}
          onChange={e => setDateTo(e.target.value)}
          placeholder="To"
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Retailer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Date</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-white text-sm font-medium">{order.orderNumber}</p>
                      <p className="text-gray-500 text-xs">{order.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{order.customerName}</p>
                    <p className="text-gray-500 text-xs">{order.customerId}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{order.retailerName}</p>
                    <p className="text-gray-500 text-xs">{order.items} items</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm font-medium">{order.total}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{order.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      {['PENDING', 'CONFIRMED'].includes(order.status) && (
                        <button
                          onClick={() => { setSelectedOrder(order); setShowCancelModal(true); }}
                          className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      {['DELIVERED', 'CANCELLED'].includes(order.status) && order.status !== 'REFUNDED' && (
                        <button
                          onClick={() => { setSelectedOrder(order); setShowRefundModal(true); }}
                          className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg text-xs font-medium transition-colors"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && !showCancelModal && !showRefundModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Order Details</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">{selectedOrder.orderNumber}</p>
                  <p className="text-gray-400 text-sm">{selectedOrder.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedOrder.status]}`}>
                  {selectedOrder.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Customer</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.customerName}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Retailer</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.retailerName}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Amount</p>
                  <p className="text-emerald-400 text-sm mt-1 font-semibold">{selectedOrder.total}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Items</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.items} items</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Payment</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.paymentMethod}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Agent</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.agentName || 'Unassigned'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 col-span-2">
                  <p className="text-gray-400 text-xs">Delivery Address</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.deliveryAddress}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Created At</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.createdAt}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Delivered At</p>
                  <p className="text-white text-sm mt-1">{selectedOrder.deliveredAt || 'N/A'}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {['PENDING', 'CONFIRMED'].includes(selectedOrder.status) && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="flex-1 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cancel Order (Admin Override)
                  </button>
                )}
                {['DELIVERED', 'CANCELLED'].includes(selectedOrder.status) && selectedOrder.status !== 'REFUNDED' && (
                  <button
                    onClick={() => setShowRefundModal(true)}
                    className="flex-1 py-2.5 bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Process Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showCancelModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">Cancel Order</h3>
            <p className="text-gray-400 text-sm mb-6">
              Are you sure you want to cancel order {selectedOrder.orderNumber}? This is an admin override and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={() => handleCancel(selectedOrder.id)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showRefundModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowRefundModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">Process Refund</h3>
            <p className="text-gray-400 text-sm mb-4">
              Process a refund of {selectedOrder.total} for order {selectedOrder.orderNumber}?
            </p>
            <div className="bg-gray-700/30 rounded-lg p-3 mb-6">
              <p className="text-gray-400 text-xs">Refund Amount</p>
              <p className="text-emerald-400 text-xl font-bold mt-1">{selectedOrder.total}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRefund(selectedOrder.id)}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Process Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
