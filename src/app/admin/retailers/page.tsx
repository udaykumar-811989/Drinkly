'use client';

import { useState } from 'react';

interface Retailer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  licenceStatus: 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'NONE';
  licenceNumber: string;
  licenceExpiry: string;
  totalProducts: number;
  totalOrders: number;
  rating: number;
  joinDate: string;
  city: string;
  address: string;
  ownerName: string;
}

const mockRetailers: Retailer[] = [
  { id: 'RT-1001', name: 'Metro Wine Shop', email: 'metro@email.com', phone: '+91 98765 11111', status: 'ACTIVE', licenceStatus: 'VERIFIED', licenceNumber: 'LIC-MH-2026-4521', licenceExpiry: '2027-03-15', totalProducts: 145, totalOrders: 2340, rating: 4.5, joinDate: '2025-08-10', city: 'Mumbai', address: '123 Linking Road', ownerName: 'Rajesh Mehta' },
  { id: 'RT-1002', name: 'City Spirits', email: 'city@email.com', phone: '+91 87654 22222', status: 'PENDING', licenceStatus: 'PENDING', licenceNumber: 'LIC-DL-2026-7832', licenceExpiry: '', totalProducts: 0, totalOrders: 0, rating: 0, joinDate: '2026-09-05', city: 'Delhi', address: '45 Connaught Place', ownerName: 'Amit Sharma' },
  { id: 'RT-1003', name: 'Wine Palace', email: 'winepalace@email.com', phone: '+91 76543 33333', status: 'ACTIVE', licenceStatus: 'VERIFIED', licenceNumber: 'LIC-KA-2026-1234', licenceExpiry: '2026-09-20', totalProducts: 89, totalOrders: 1567, rating: 4.2, joinDate: '2025-11-20', city: 'Bangalore', address: '67 MG Road', ownerName: 'Priya Nair' },
  { id: 'RT-1004', name: 'Premium Spirits', email: 'premium@email.com', phone: '+91 65432 44444', status: 'SUSPENDED', licenceStatus: 'EXPIRED', licenceNumber: 'LIC-MH-2025-9876', licenceExpiry: '2026-08-30', totalProducts: 210, totalOrders: 3456, rating: 4.7, joinDate: '2025-06-15', city: 'Pune', address: '89 FC Road', ownerName: 'Sanjay Patil' },
  { id: 'RT-1005', name: 'Beer Barn', email: 'beerbarn@email.com', phone: '+91 54321 55555', status: 'PENDING', licenceStatus: 'PENDING', licenceNumber: 'LIC-TN-2026-5678', licenceExpiry: '', totalProducts: 0, totalOrders: 0, rating: 0, joinDate: '2026-09-07', city: 'Chennai', address: '34 Anna Nagar', ownerName: 'Vikram Raj' },
  { id: 'RT-1006', name: 'Liquor Land', email: 'liquorland@email.com', phone: '+91 43210 66666', status: 'ACTIVE', licenceStatus: 'VERIFIED', licenceNumber: 'LIC-WB-2026-3456', licenceExpiry: '2027-01-10', totalProducts: 67, totalOrders: 890, rating: 3.9, joinDate: '2026-02-28', city: 'Kolkata', address: '56 Park Street', ownerName: 'Arun Das' },
  { id: 'RT-1007', name: 'Quick Liquors', email: 'quick@email.com', phone: '+91 32109 77777', status: 'REJECTED', licenceStatus: 'NONE', licenceNumber: '', licenceExpiry: '', totalProducts: 0, totalOrders: 0, rating: 0, joinDate: '2026-08-15', city: 'Hyderabad', address: '78 Banjara Hills', ownerName: 'Kiran Rao' },
  { id: 'RT-1008', name: 'The Barrel House', email: 'barrel@email.com', phone: '+91 21098 88888', status: 'PENDING', licenceStatus: 'PENDING', licenceNumber: 'LIC-GJ-2026-6789', licenceExpiry: '', totalProducts: 0, totalOrders: 0, rating: 0, joinDate: '2026-09-08', city: 'Ahmedabad', address: '90 SG Highway', ownerName: 'Meera Patel' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  SUSPENDED: 'bg-red-500/20 text-red-400 border-red-500/30',
  REJECTED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const licenceStatusColors: Record<string, string> = {
  VERIFIED: 'bg-green-500/20 text-green-400',
  PENDING: 'bg-amber-500/20 text-amber-400',
  EXPIRED: 'bg-red-500/20 text-red-400',
  NONE: 'bg-gray-500/20 text-gray-400',
};

export default function RetailersPage() {
  const [retailers, setRetailers] = useState(mockRetailers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [licenceFilter, setLicenceFilter] = useState<string>('ALL');
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');

  const filtered = retailers.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesLicence = licenceFilter === 'ALL' || r.licenceStatus === licenceFilter;
    return matchesSearch && matchesStatus && matchesLicence;
  });

  const pendingCount = retailers.filter(r => r.status === 'PENDING').length;

  const handleReview = (retailerId: string) => {
    setRetailers(prev => prev.map(r =>
      r.id === retailerId ? { ...r, status: reviewAction === 'approve' ? 'ACTIVE' : 'REJECTED' } : r
    ));
    setShowReviewModal(false);
    setSelectedRetailer(null);
  };

  const handleSuspend = (retailerId: string) => {
    setRetailers(prev => prev.map(r =>
      r.id === retailerId ? { ...r, status: 'SUSPENDED' } : r
    ));
    setSelectedRetailer(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Retailer Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} retailers • {pendingCount} pending approval</p>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-amber-400 font-medium">{pendingCount} retailers awaiting approval</p>
              <p className="text-gray-400 text-sm">Review and approve new retailer applications</p>
            </div>
            <button
              onClick={() => setStatusFilter('PENDING')}
              className="ml-auto px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Review Now
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email, ID, or owner..."
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
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <select
          value={licenceFilter}
          onChange={e => setLicenceFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Licence Status</option>
          <option value="VERIFIED">Verified</option>
          <option value="PENDING">Pending</option>
          <option value="EXPIRED">Expired</option>
          <option value="NONE">No Licence</option>
        </select>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Retailer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Owner</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Licence</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Products</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Orders</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Rating</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(retailer => (
                <tr key={retailer.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm font-medium">
                        🏪
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{retailer.name}</p>
                        <p className="text-gray-500 text-xs">{retailer.id} • {retailer.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{retailer.ownerName}</p>
                    <p className="text-gray-500 text-xs">{retailer.phone}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[retailer.status]}`}>
                      {retailer.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${licenceStatusColors[retailer.licenceStatus]}`}>
                      {retailer.licenceStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{retailer.totalProducts}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{retailer.totalOrders.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-gray-300 text-sm">{retailer.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedRetailer(retailer)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      {retailer.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => { setSelectedRetailer(retailer); setReviewAction('approve'); setShowReviewModal(true); }}
                            className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { setSelectedRetailer(retailer); setReviewAction('reject'); setShowReviewModal(true); }}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {retailer.status === 'ACTIVE' && (
                        <button
                          onClick={() => { setSelectedRetailer(retailer); handleSuspend(retailer.id); }}
                          className="px-3 py-1.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-xs font-medium transition-colors"
                        >
                          Suspend
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

      {selectedRetailer && !showReviewModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRetailer(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Retailer Details</h3>
              <button onClick={() => setSelectedRetailer(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">🏪</div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{selectedRetailer.name}</p>
                  <p className="text-gray-400 text-sm">{selectedRetailer.id} • {selectedRetailer.city}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedRetailer.status]}`}>
                  {selectedRetailer.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Owner</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.ownerName}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.email}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.phone}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Address</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.address}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Licence Number</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.licenceNumber || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Licence Expiry</p>
                  <p className={`text-sm mt-1 font-medium ${
                    !selectedRetailer.licenceExpiry ? 'text-gray-500' :
                    new Date(selectedRetailer.licenceExpiry) < new Date() ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {selectedRetailer.licenceExpiry || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Products</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.totalProducts}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Orders</p>
                  <p className="text-white text-sm mt-1">{selectedRetailer.totalOrders.toLocaleString()}</p>
                </div>
              </div>

              {selectedRetailer.status === 'PENDING' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setReviewAction('approve'); setShowReviewModal(true); }}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve Retailer
                  </button>
                  <button
                    onClick={() => { setReviewAction('reject'); setShowReviewModal(true); }}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Reject Retailer
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReviewModal && selectedRetailer && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">
              {reviewAction === 'approve' ? 'Approve Retailer' : 'Reject Retailer'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {reviewAction === 'approve'
                ? `Are you sure you want to approve ${selectedRetailer.name}? They will be able to list products and receive orders.`
                : `Are you sure you want to reject ${selectedRetailer.name}? They will not be able to operate on the platform.`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(selectedRetailer.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  reviewAction === 'approve'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {reviewAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
