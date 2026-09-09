'use client';

import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FAILED';
  totalOrders: number;
  totalSpent: string;
  joinDate: string;
  lastActive: string;
  address: string;
  city: string;
  ageVerified: boolean;
}

const mockCustomers: Customer[] = [
  { id: 'C-1001', name: 'Aarav Patel', email: 'aarav@email.com', phone: '+91 98765 43210', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalOrders: 47, totalSpent: '$2,340', joinDate: '2025-12-15', lastActive: '2h ago', address: '12 MG Road', city: 'Mumbai', ageVerified: true },
  { id: 'C-1002', name: 'Sneha Sharma', email: 'sneha@email.com', phone: '+91 87654 32109', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalOrders: 23, totalSpent: '$1,120', joinDate: '2026-01-20', lastActive: '1d ago', address: '45 Park Street', city: 'Kolkata', ageVerified: true },
  { id: 'C-1003', name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91 76543 21098', status: 'SUSPENDED', verificationStatus: 'VERIFIED', totalOrders: 5, totalSpent: '$230', joinDate: '2026-03-10', lastActive: '5d ago', address: '78 Brigade Road', city: 'Bangalore', ageVerified: true },
  { id: 'C-1004', name: 'Priya Singh', email: 'priya@email.com', phone: '+91 65432 10987', status: 'ACTIVE', verificationStatus: 'PENDING', totalOrders: 0, totalSpent: '$0', joinDate: '2026-09-01', lastActive: 'Just now', address: '23 Anna Salai', city: 'Chennai', ageVerified: false },
  { id: 'C-1005', name: 'Vikram Reddy', email: 'vikram@email.com', phone: '+91 54321 09876', status: 'BLOCKED', verificationStatus: 'FAILED', totalOrders: 2, totalSpent: '$95', joinDate: '2026-06-05', lastActive: '15d ago', address: '56 Banjara Hills', city: 'Hyderabad', ageVerified: false },
  { id: 'C-1006', name: 'Neha Gupta', email: 'neha@email.com', phone: '+91 43210 98765', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalOrders: 89, totalSpent: '$4,560', joinDate: '2025-10-22', lastActive: '30m ago', address: '90 Civil Lines', city: 'Delhi', ageVerified: true },
  { id: 'C-1007', name: 'Aditya Joshi', email: 'aditya@email.com', phone: '+91 32109 87654', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalOrders: 12, totalSpent: '$670', joinDate: '2026-04-18', lastActive: '3h ago', address: '34 FC Road', city: 'Pune', ageVerified: true },
  { id: 'C-1008', name: 'Kavya Nair', email: 'kavya@email.com', phone: '+91 21098 76543', status: 'SUSPENDED', verificationStatus: 'VERIFIED', totalOrders: 34, totalSpent: '$1,890', joinDate: '2025-11-30', lastActive: '2d ago', address: '67 MG Road', city: ' Kochi', ageVerified: true },
];

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  SUSPENDED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  BLOCKED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const verificationColors: Record<string, string> = {
  VERIFIED: 'bg-green-500/20 text-green-400',
  PENDING: 'bg-amber-500/20 text-amber-400',
  FAILED: 'bg-red-500/20 text-red-400',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [verificationFilter, setVerificationFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'suspend' | 'block'>('activate');
  const itemsPerPage = 5;

  const filtered = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesVerification = verificationFilter === 'ALL' || c.verificationStatus === verificationFilter;
    return matchesSearch && matchesStatus && matchesVerification;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleAction = (customerId: string) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, status: actionType === 'activate' ? 'ACTIVE' : actionType === 'suspend' ? 'SUSPENDED' : 'BLOCKED' } : c
    ));
    setShowActionModal(false);
    setSelectedCustomer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Customer Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} customers found</p>
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
            placeholder="Search by name, email, ID, or phone..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="BLOCKED">Blocked</option>
        </select>
        <select
          value={verificationFilter}
          onChange={e => { setVerificationFilter(e.target.value); setCurrentPage(1); }}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Contact</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Verification</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Orders</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Spent</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Last Active</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {paginated.map(customer => (
                <tr key={customer.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-sm font-medium">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{customer.name}</p>
                        <p className="text-gray-500 text-xs">{customer.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{customer.email}</p>
                    <p className="text-gray-500 text-xs">{customer.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[customer.status]}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${verificationColors[customer.verificationStatus]}`}>
                      {customer.verificationStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{customer.totalOrders}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm font-medium">{customer.totalSpent}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs">{customer.lastActive}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setActionType(customer.status === 'ACTIVE' ? 'suspend' : 'activate');
                          setShowActionModal(true);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          customer.status === 'BLOCKED' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' :
                          customer.status === 'ACTIVE' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' :
                          'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {customer.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-5 py-3 border-t border-gray-700/50 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedCustomer && !showActionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedCustomer(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Customer Details</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xl font-bold">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold text-lg">{selectedCustomer.name}</p>
                  <p className="text-gray-400 text-sm">{selectedCustomer.id}</p>
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedCustomer.status]}`}>
                  {selectedCustomer.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.email}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.phone}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">City</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.city}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Address</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.address}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Orders</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.totalOrders}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Spent</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.totalSpent}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Joined</p>
                  <p className="text-white text-sm mt-1">{selectedCustomer.joinDate}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Age Verified</p>
                  <p className={`text-sm mt-1 font-medium ${selectedCustomer.ageVerified ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedCustomer.ageVerified ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => {
                    setActionType(selectedCustomer.status === 'ACTIVE' ? 'suspend' : 'activate');
                    setShowActionModal(true);
                  }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCustomer.status === 'ACTIVE'
                      ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                      : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  }`}
                >
                  {selectedCustomer.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account'}
                </button>
                {selectedCustomer.status !== 'BLOCKED' && (
                  <button
                    onClick={() => { setActionType('block'); setShowActionModal(true); }}
                    className="flex-1 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Block Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowActionModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">
              {actionType === 'activate' ? 'Activate Account' : actionType === 'suspend' ? 'Suspend Account' : 'Block Account'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {actionType === 'activate'
                ? `Are you sure you want to activate ${selectedCustomer.name}'s account?`
                : actionType === 'suspend'
                ? `Are you sure you want to suspend ${selectedCustomer.name}'s account? They won't be able to place orders.`
                : `Are you sure you want to block ${selectedCustomer.name}'s account? This action requires SUPER_ADMIN approval.`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowActionModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(selectedCustomer.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  actionType === 'activate' ? 'bg-green-500 hover:bg-green-600 text-white' :
                  actionType === 'suspend' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                  'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {actionType === 'activate' ? 'Activate' : actionType === 'suspend' ? 'Suspend' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
