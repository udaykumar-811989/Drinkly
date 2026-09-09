'use client';

import { useState } from 'react';

interface Licence {
  id: string;
  retailerName: string;
  retailerId: string;
  licenceNumber: string;
  licenceType: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRED' | 'REJECTED';
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  jurisdiction: string;
  uploadedAt: string;
}

const mockLicences: Licence[] = [
  { id: 'LIC-1001', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', licenceNumber: 'LIC-MH-2026-4521', licenceType: 'Retail Liquor', status: 'VERIFIED', issueDate: '2025-03-15', expiryDate: '2027-03-15', issuingAuthority: 'Maharashtra Excise Dept', jurisdiction: 'Maharashtra', uploadedAt: '2025-03-10' },
  { id: 'LIC-1002', retailerName: 'City Spirits', retailerId: 'RT-1002', licenceNumber: 'LIC-DL-2026-7832', licenceType: 'Liquor Store', status: 'PENDING', issueDate: '', expiryDate: '', issuingAuthority: 'Delhi Excise', jurisdiction: 'Delhi', uploadedAt: '2026-09-05' },
  { id: 'LIC-1003', retailerName: 'Wine Palace', retailerId: 'RT-1003', licenceNumber: 'LIC-KA-2026-1234', licenceType: 'Wine Shop', status: 'VERIFIED', issueDate: '2025-01-10', expiryDate: '2026-09-20', issuingAuthority: 'Karnataka Excise', jurisdiction: 'Karnataka', uploadedAt: '2025-01-05' },
  { id: 'LIC-1004', retailerName: 'Premium Spirits', retailerId: 'RT-1004', licenceNumber: 'LIC-MH-2025-9876', licenceType: 'Liquor Store', status: 'EXPIRED', issueDate: '2024-08-30', expiryDate: '2026-08-30', issuingAuthority: 'Maharashtra Excise Dept', jurisdiction: 'Maharashtra', uploadedAt: '2024-08-25' },
  { id: 'LIC-1005', retailerName: 'Beer Barn', retailerId: 'RT-1005', licenceNumber: 'LIC-TN-2026-5678', licenceType: 'Beer & Wine', status: 'PENDING', issueDate: '', expiryDate: '', issuingAuthority: 'Tamil Nadu TASMAC', jurisdiction: 'Tamil Nadu', uploadedAt: '2026-09-07' },
  { id: 'LIC-1006', retailerName: 'Liquor Land', retailerId: 'RT-1006', licenceNumber: 'LIC-WB-2026-3456', licenceType: 'Retail Liquor', status: 'VERIFIED', issueDate: '2025-06-01', expiryDate: '2027-01-10', issuingAuthority: 'West Bengal Excise', jurisdiction: 'West Bengal', uploadedAt: '2025-05-28' },
  { id: 'LIC-1007', retailerName: 'Quick Liquors', retailerId: 'RT-1007', licenceNumber: '', licenceType: '', status: 'REJECTED', issueDate: '', expiryDate: '', issuingAuthority: '', jurisdiction: 'Telangana', uploadedAt: '2026-08-15' },
  { id: 'LIC-1008', retailerName: 'The Barrel House', retailerId: 'RT-1008', licenceNumber: 'LIC-GJ-2026-6789', licenceType: 'Liquor Store', status: 'PENDING', issueDate: '', expiryDate: '', issuingAuthority: 'Gujarat Excise', jurisdiction: 'Gujarat', uploadedAt: '2026-09-08' },
];

const statusColors: Record<string, string> = {
  VERIFIED: 'bg-green-500/20 text-green-400 border-green-500/30',
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  EXPIRED: 'bg-red-500/20 text-red-400 border-red-500/30',
  REJECTED: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function LicencesPage() {
  const [licences, setLicences] = useState(mockLicences);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedLicence, setSelectedLicence] = useState<Licence | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  const filtered = licences.filter(l => {
    const matchesSearch = l.retailerName.toLowerCase().includes(search.toLowerCase()) ||
      l.licenceNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = licences.filter(l => l.status === 'PENDING').length;
  const expiredCount = licences.filter(l => l.status === 'EXPIRED').length;

  const handleAction = (licenceId: string) => {
    setLicences(prev => prev.map(l =>
      l.id === licenceId ? { ...l, status: actionType === 'approve' ? 'VERIFIED' : 'REJECTED' } : l
    ));
    setShowActionModal(false);
    setSelectedLicence(null);
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Licence Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} licences • {pendingCount} pending • {expiredCount} expired</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="text-2xl font-bold text-white">{pendingCount}</p>
              <p className="text-amber-400 text-sm">Pending Verification</p>
            </div>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-2xl font-bold text-white">{expiredCount}</p>
              <p className="text-red-400 text-sm">Expired Licences</p>
            </div>
          </div>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-2xl font-bold text-white">{licences.filter(l => l.status === 'VERIFIED').length}</p>
              <p className="text-green-400 text-sm">Verified Licences</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by retailer, licence number, or ID..."
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
          <option value="VERIFIED">Verified</option>
          <option value="EXPIRED">Expired</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Retailer</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Licence Number</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Jurisdiction</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Expiry</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(licence => (
                <tr key={licence.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-white text-sm font-medium">{licence.retailerName}</p>
                      <p className="text-gray-500 text-xs">{licence.retailerId}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm font-mono">{licence.licenceNumber || 'N/A'}</td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{licence.licenceType || 'N/A'}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[licence.status]}`}>
                      {licence.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{licence.jurisdiction}</td>
                  <td className="px-5 py-4">
                    {licence.expiryDate ? (
                      <div>
                        <p className={`text-sm ${getDaysUntilExpiry(licence.expiryDate) <= 30 ? 'text-red-400' : getDaysUntilExpiry(licence.expiryDate) <= 90 ? 'text-amber-400' : 'text-gray-300'}`}>
                          {licence.expiryDate}
                        </p>
                        <p className="text-xs text-gray-500">{getDaysUntilExpiry(licence.expiryDate)} days left</p>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedLicence(licence)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      {licence.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => { setSelectedLicence(licence); setActionType('approve'); setShowActionModal(true); }}
                            className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => { setSelectedLicence(licence); setActionType('reject'); setShowActionModal(true); }}
                            className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors"
                          >
                            Reject
                          </button>
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

      {selectedLicence && !showActionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedLicence(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Licence Details</h3>
              <button onClick={() => setSelectedLicence(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-semibold text-lg">{selectedLicence.retailerName}</p>
                  <p className="text-gray-400 text-sm">{selectedLicence.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedLicence.status]}`}>
                  {selectedLicence.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Licence Number</p>
                  <p className="text-white text-sm mt-1 font-mono">{selectedLicence.licenceNumber || 'Not provided'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Licence Type</p>
                  <p className="text-white text-sm mt-1">{selectedLicence.licenceType || 'Not specified'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Jurisdiction</p>
                  <p className="text-white text-sm mt-1">{selectedLicence.jurisdiction}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Issuing Authority</p>
                  <p className="text-white text-sm mt-1">{selectedLicence.issuingAuthority || 'N/A'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Issue Date</p>
                  <p className="text-white text-sm mt-1">{selectedLicence.issueDate || 'N/A'}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Expiry Date</p>
                  <p className={`text-sm mt-1 font-medium ${selectedLicence.expiryDate && getDaysUntilExpiry(selectedLicence.expiryDate) <= 30 ? 'text-red-400' : 'text-white'}`}>
                    {selectedLicence.expiryDate || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 col-span-2">
                  <p className="text-gray-400 text-xs">Uploaded At</p>
                  <p className="text-white text-sm mt-1">{selectedLicence.uploadedAt}</p>
                </div>
              </div>
              {selectedLicence.status === 'PENDING' && (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setActionType('approve'); setShowActionModal(true); }} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">Approve Licence</button>
                  <button onClick={() => { setActionType('reject'); setShowActionModal(true); }} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">Reject Licence</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedLicence && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowActionModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">{actionType === 'approve' ? 'Approve Licence' : 'Reject Licence'}</h3>
            <p className="text-gray-400 text-sm mb-6">
              {actionType === 'approve' ? `Approve the licence for ${selectedLicence.retailerName}?` : `Reject the licence for ${selectedLicence.retailerName}?`}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowActionModal(false)} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => handleAction(selectedLicence.id)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${actionType === 'approve' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}>
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
