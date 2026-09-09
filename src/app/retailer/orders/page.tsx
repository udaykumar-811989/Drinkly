'use client';

import React, { useState, useMemo } from 'react';

const initialOrders = [
  { id: '#1247', customer: 'James Wilson', phone: '+44 7700 900123', items: [{ name: 'Jameson Whiskey', qty: 1, price: 35.00 }, { name: 'Coca-Cola', qty: 2, price: 2.50 }], total: 40.00, status: 'pending', time: '2 min ago', address: '14 Baker Street, London' },
  { id: '#1246', customer: 'Sarah Mitchell', phone: '+44 7700 900456', items: [{ name: 'Grey Goose Vodka', qty: 1, price: 42.00 }, { name: 'Tonic Water', qty: 4, price: 3.00 }, { name: 'Limes', qty: 2, price: 1.50 }], total: 57.00, status: 'preparing', time: '8 min ago', address: '22 Oxford Street, London' },
  { id: '#1245', customer: 'Michael Brown', phone: '+44 7700 900789', items: [{ name: 'Moët & Chandon', qty: 1, price: 45.00 }, { name: 'Plastic Flutes', qty: 6, price: 1.00 }], total: 51.00, status: 'ready', time: '15 min ago', address: '8 Regent Street, London' },
  { id: '#1244', customer: 'Emily Davis', phone: '+44 7700 900234', items: [{ name: 'Jack Daniel\'s', qty: 2, price: 28.00 }, { name: 'Whiskey Glasses', qty: 4, price: 8.00 }], total: 88.00, status: 'completed', time: '22 min ago', address: '35 Bond Street, London' },
  { id: '#1243', customer: 'David Johnson', phone: '+44 7700 900567', items: [{ name: 'Bacardi Rum', qty: 1, price: 22.00 }], total: 22.00, status: 'completed', time: '30 min ago', address: '19 Mayfair, London' },
  { id: '#1242', customer: 'Lisa Anderson', phone: '+44 7700 900890', items: [{ name: 'Hendricks Gin', qty: 1, price: 32.00 }, { name: 'Cucumber', qty: 1, price: 0.80 }], total: 32.80, status: 'cancelled', time: '45 min ago', address: '7 Chelsea, London' },
  { id: '#1241', customer: 'Tom Harris', phone: '+44 7700 900345', items: [{ name: 'Absolut Vodka', qty: 3, price: 25.00 }], total: 75.00, status: 'pending', time: '50 min ago', address: '42 Knightsbridge, London' },
  { id: '#1240', customer: 'Rachel Green', phone: '+44 7700 900678', items: [{ name: 'Tequila Rose', qty: 2, price: 18.00 }, { name: 'Shot Glasses', qty: 8, price: 1.50 }], total: 48.00, status: 'preparing', time: '1 hr ago', address: '15 Soho, London' },
];

const tabs = ['Pending', 'Accepted', 'Preparing', 'Ready', 'Completed', 'Cancelled'];

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  preparing: 'bg-blue-100 text-blue-700 border-blue-200',
  ready: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

export default function RetailerOrders() {
  const [orders, setOrders] = useState(initialOrders);
  const [activeTab, setActiveTab] = useState('Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesTab = activeTab.toLowerCase() === 'accepted' ? o.status === 'preparing' || o.status === 'ready' : o.status === activeTab.toLowerCase();
      const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const updateStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    setSelectedOrder(null);
  };

  const orderCount = (status: string) => {
    if (status === 'Accepted') return orders.filter(o => o.status === 'preparing' || o.status === 'ready').length;
    return orders.filter(o => o.status === status.toLowerCase()).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and fulfill customer orders</p>
        </div>
        <div className="flex gap-2">
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors
              ${activeTab === tab ? 'bg-purple-600 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'}`}
          >
            {tab}
            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeTab === tab ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
              {orderCount(tab)}
            </span>
          </button>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Search by order number or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z" /></svg>
            </div>
            <p className="text-gray-500">No orders in this category</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {order.customer.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{order.id}</h3>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{order.customer}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{order.phone} &middot; {order.time}</p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                        {order.address}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">£{order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">{order.items.length} item{order.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs font-medium text-gray-500 mb-2">Order Items</p>
                  <div className="space-y-1.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-gray-700">{item.qty}x {item.name}</span>
                        <span className="text-gray-500">£{(item.qty * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === 'pending' && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateStatus(order.id, 'preparing')}
                      className="flex-1 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                      Accept Order
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'cancelled')}
                      className="px-4 py-2.5 bg-white text-red-600 text-sm font-medium rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {order.status === 'preparing' && (
                  <div className="mt-4">
                    <button
                      onClick={() => updateStatus(order.id, 'ready')}
                      className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      Mark as Ready
                    </button>
                  </div>
                )}

                {order.status === 'ready' && (
                  <div className="mt-4">
                    <button
                      onClick={() => updateStatus(order.id, 'completed')}
                      className="w-full py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
