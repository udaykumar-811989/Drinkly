'use client';

import { useState } from 'react';

interface DeliveryAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'BLOCKED';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED';
  totalDeliveries: number;
  rating: number;
  joinDate: string;
  city: string;
  vehicleType: string;
  vehicleNumber: string;
  totalEarnings: string;
  onTimeRate: string;
  lastActive: string;
}

const mockAgents: DeliveryAgent[] = [
  { id: 'AG-1001', name: 'Ravi Kumar', email: 'ravi@email.com', phone: '+91 98765 12345', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalDeliveries: 1245, rating: 4.8, joinDate: '2025-07-15', city: 'Mumbai', vehicleType: 'Bike', vehicleNumber: 'MH-12-AB-1234', totalEarnings: '$12,450', onTimeRate: '96%', lastActive: '5m ago' },
  { id: 'AG-1002', name: 'Suresh Patel', email: 'suresh@email.com', phone: '+91 87654 23456', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalDeliveries: 890, rating: 4.5, joinDate: '2025-10-20', city: 'Delhi', vehicleType: 'Scooter', vehicleNumber: 'DL-04-CD-5678', totalEarnings: '$8,900', onTimeRate: '92%', lastActive: '15m ago' },
  { id: 'AG-1003', name: 'Amit Singh', email: 'amit@email.com', phone: '+91 76543 34567', status: 'PENDING', verificationStatus: 'PENDING', totalDeliveries: 0, rating: 0, joinDate: '2026-09-06', city: 'Bangalore', vehicleType: 'Bike', vehicleNumber: 'KA-01-EF-9012', totalEarnings: '$0', onTimeRate: '0%', lastActive: 'Just now' },
  { id: 'AG-1004', name: 'Deepak Nair', email: 'deepak@email.com', phone: '+91 65432 45678', status: 'SUSPENDED', verificationStatus: 'VERIFIED', totalDeliveries: 567, rating: 3.8, joinDate: '2026-01-10', city: 'Chennai', vehicleType: 'Car', vehicleNumber: 'TN-09-GH-3456', totalEarnings: '$5,670', onTimeRate: '85%', lastActive: '3d ago' },
  { id: 'AG-1005', name: 'Mohammed Ali', email: 'mohammed@email.com', phone: '+91 54321 56789', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalDeliveries: 2100, rating: 4.9, joinDate: '2025-05-01', city: 'Hyderabad', vehicleType: 'Bike', vehicleNumber: 'TS-07-IJ-7890', totalEarnings: '$21,000', onTimeRate: '98%', lastActive: '1m ago' },
  { id: 'AG-1006', name: 'Rajesh Gupta', email: 'rajesh@email.com', phone: '+91 43210 67890', status: 'BLOCKED', verificationStatus: 'REJECTED', totalDeliveries: 45, rating: 2.1, joinDate: '2026-06-15', city: 'Pune', vehicleType: 'Bike', vehicleNumber: 'MH-14-KL-1111', totalEarnings: '$450', onTimeRate: '60%', lastActive: '30d ago' },
  { id: 'AG-1007', name: 'Sanjay Verma', email: 'sanjay@email.com', phone: '+91 32109 78901', status: 'PENDING', verificationStatus: 'PENDING', totalDeliveries: 0, rating: 0, joinDate: '2026-09-08', city: 'Kolkata', vehicleType: 'Scooter', vehicleNumber: 'WB-06-MN-2222', totalEarnings: '$0', onTimeRate: '0%', lastActive: '2h ago' },
  { id: 'AG-1008', name: 'Karan Joshi', email: 'karan@email.com', phone: '+91 21098 89012', status: 'ACTIVE', verificationStatus: 'VERIFIED', totalDeliveries: 1567, rating: 4.6, joinDate: '2025-09-10', city: 'Ahmedabad', vehicleType: 'Bike', vehicleNumber: 'GJ-01-OP-3333', totalEarnings: '$15,670', onTimeRate: '94%', lastActive: '10m ago' },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  SUSPENDED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  BLOCKED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const verificationColors: Record<string, string> = {
  VERIFIED: 'bg-green-500/20 text-green-400',
  PENDING: 'bg-amber-500/20 text-amber-400',
  REJECTED: 'bg-red-500/20 text-red-400',
};

export default function DeliveryAgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedAgent, setSelectedAgent] = useState<DeliveryAgent | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'suspend' | 'block'>('approve');

  const filtered = agents.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase()) ||
      a.phone.includes(search);
    const matchesStatus = statusFilter === 'ALL' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = agents.filter(a => a.status === 'PENDING').length;

  const handleAction = (agentId: string) => {
    setAgents(prev => prev.map(a =>
      a.id === agentId ? {
        ...a,
        status: actionType === 'approve' ? 'ACTIVE' : actionType === 'suspend' ? 'SUSPENDED' : 'BLOCKED',
        verificationStatus: actionType === 'approve' ? 'VERIFIED' : a.verificationStatus,
      } : a
    ));
    setShowActionModal(false);
    setSelectedAgent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Delivery Agent Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} agents • {pendingCount} pending verification</p>
        </div>
      </div>

      {pendingCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚚</span>
            <div>
              <p className="text-amber-400 font-medium">{pendingCount} agents pending verification</p>
              <p className="text-gray-400 text-sm">Review documents and verify new delivery agents</p>
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
            placeholder="Search by name, email, ID, or phone..."
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
          <option value="BLOCKED">Blocked</option>
        </select>
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Agent</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Vehicle</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Verification</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Deliveries</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Rating</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">On-Time</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(agent => (
                <tr key={agent.id} className="hover:bg-gray-700/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-sm font-medium">
                        {agent.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{agent.name}</p>
                        <p className="text-gray-500 text-xs">{agent.id} • {agent.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{agent.vehicleType}</p>
                    <p className="text-gray-500 text-xs">{agent.vehicleNumber}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[agent.status]}`}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${verificationColors[agent.verificationStatus]}`}>
                      {agent.verificationStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{agent.totalDeliveries.toLocaleString()}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400 text-sm">★</span>
                      <span className="text-gray-300 text-sm">{agent.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-300 text-sm">{agent.onTimeRate}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        View
                      </button>
                      {agent.status === 'PENDING' && (
                        <button
                          onClick={() => { setSelectedAgent(agent); setActionType('approve'); setShowActionModal(true); }}
                          className="px-3 py-1.5 bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg text-xs font-medium transition-colors"
                        >
                          Approve
                        </button>
                      )}
                      {agent.status === 'ACTIVE' && (
                        <button
                          onClick={() => { setSelectedAgent(agent); setActionType('suspend'); setShowActionModal(true); }}
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

      {selectedAgent && !showActionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedAgent(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Agent Details</h3>
              <button onClick={() => setSelectedAgent(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 text-xl font-bold">
                  {selectedAgent.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{selectedAgent.name}</p>
                  <p className="text-gray-400 text-sm">{selectedAgent.id} • {selectedAgent.city}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedAgent.status]}`}>
                  {selectedAgent.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.email}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Phone</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.phone}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Vehicle Type</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.vehicleType}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Vehicle Number</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.vehicleNumber}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Deliveries</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.totalDeliveries.toLocaleString()}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Earnings</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.totalEarnings}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Rating</p>
                  <p className="text-white text-sm mt-1 flex items-center gap-1">
                    <span className="text-amber-400">★</span> {selectedAgent.rating || 'N/A'}
                  </p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">On-Time Rate</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.onTimeRate}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Joined</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.joinDate}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Last Active</p>
                  <p className="text-white text-sm mt-1">{selectedAgent.lastActive}</p>
                </div>
              </div>

              {selectedAgent.status === 'PENDING' && (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setActionType('approve'); setShowActionModal(true); }}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve Agent
                  </button>
                  <button
                    onClick={() => { setActionType('block'); setShowActionModal(true); }}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Reject Agent
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedAgent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowActionModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">
              {actionType === 'approve' ? 'Approve Agent' : actionType === 'suspend' ? 'Suspend Agent' : 'Block Agent'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {actionType === 'approve'
                ? `Approve ${selectedAgent.name} as a delivery agent? They will be able to accept delivery assignments.`
                : actionType === 'suspend'
                ? `Suspend ${selectedAgent.name}? They will not be able to accept new deliveries.`
                : `Block ${selectedAgent.name}? This will permanently remove their access.`
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
                onClick={() => handleAction(selectedAgent.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  actionType === 'approve' ? 'bg-green-500 hover:bg-green-600 text-white' :
                  actionType === 'suspend' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                  'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {actionType === 'approve' ? 'Approve' : actionType === 'suspend' ? 'Suspend' : 'Block'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
