'use client';

import React, { useState } from 'react';

const initialStaff = [
  { id: 1, name: 'John Doe', email: 'john@whiskeywarehouse.com', phone: '+44 7700 900123', role: 'RETAILER_OWNER', status: 'active', joinDate: '2023-01-15', avatar: 'JD', lastActive: '2 min ago' },
  { id: 2, name: 'Sarah Mitchell', email: 'sarah@whiskeywarehouse.com', phone: '+44 7700 900456', role: 'RETAILER_STAFF', status: 'active', joinDate: '2023-06-20', avatar: 'SM', lastActive: '15 min ago' },
  { id: 3, name: 'Michael Brown', email: 'michael@whiskeywarehouse.com', phone: '+44 7700 900789', role: 'RETAILER_STAFF', status: 'active', joinDate: '2023-09-10', avatar: 'MB', lastActive: '1 hr ago' },
  { id: 4, name: 'Emily Davis', email: 'emily@whiskeywarehouse.com', phone: '+44 7700 900234', role: 'RETAILER_STAFF', status: 'inactive', joinDate: '2024-01-05', avatar: 'ED', lastActive: '3 days ago' },
];

const activityLog = [
  { user: 'Sarah Mitchell', action: 'Accepted order #1246', time: '8 min ago', type: 'order' },
  { user: 'John Doe', action: 'Updated product: Jameson Whiskey', time: '25 min ago', type: 'product' },
  { user: 'Michael Brown', action: 'Completed order #1244', time: '22 min ago', type: 'order' },
  { user: 'Sarah Mitchell', action: 'Updated inventory: Coca-Cola', time: '1 hr ago', type: 'inventory' },
  { user: 'John Doe', action: 'Uploaded licence document', time: '2 hrs ago', type: 'licence' },
];

export default function RetailerStaff() {
  const [staff, setStaff] = useState(initialStaff);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'RETAILER_STAFF' });
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newStaff = {
      id: Math.max(...staff.map(s => s.id)) + 1,
      name: inviteForm.name,
      email: inviteForm.email,
      phone: '',
      role: inviteForm.role as 'RETAILER_OWNER' | 'RETAILER_STAFF',
      status: 'active' as const,
      joinDate: new Date().toISOString().split('T')[0],
      avatar: inviteForm.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      lastActive: 'Just invited',
    };
    setStaff(prev => [...prev, newStaff]);
    setShowInviteModal(false);
    setInviteForm({ name: '', email: '', role: 'RETAILER_STAFF' });
  };

  const removeStaff = (id: number) => {
    setStaff(prev => prev.filter(s => s.id !== id));
    setSelectedStaff(null);
  };

  const toggleStatus = (id: number) => {
    setStaff(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'active' ? 'inactive' : 'active' } : s));
  };

  const roleColors: Record<string, string> = {
    RETAILER_OWNER: 'bg-purple-100 text-purple-700',
    RETAILER_STAFF: 'bg-blue-100 text-blue-700',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your team members and roles</p>
        </div>
        <button onClick={() => setShowInviteModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" /></svg>
          Invite Staff
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Staff</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{staff.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Active Staff</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{staff.filter(s => s.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Owners</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{staff.filter(s => s.role === 'RETAILER_OWNER').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Team Members</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {staff.map((member) => (
              <div key={member.id} className="p-5 hover:bg-gray-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {member.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-gray-900">{member.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
                          {member.role === 'RETAILER_OWNER' ? 'Owner' : 'Staff'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{member.email}</p>
                      {member.phone && <p className="text-xs text-gray-400">{member.phone}</p>}
                      <p className="text-xs text-gray-400 mt-0.5">Last active: {member.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {member.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleStatus(member.id)} className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Toggle status">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                      </button>
                      {member.role !== 'RETAILER_OWNER' && (
                        <button onClick={() => removeStaff(member.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Remove">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Activity Log</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {activityLog.map((log, i) => (
              <div key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${log.type === 'order' ? 'bg-blue-100' : log.type === 'product' ? 'bg-purple-100' : log.type === 'inventory' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
                    <span className="text-xs">{log.type === 'order' ? '📦' : log.type === 'product' ? '🏷️' : log.type === 'inventory' ? '📋' : '📄'}</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium text-gray-900">{log.user}</span> {log.action}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{log.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Invite Staff Member</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required value={inviteForm.name} onChange={(e) => setInviteForm({...inviteForm, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" required value={inviteForm.email} onChange={(e) => setInviteForm({...inviteForm, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select value={inviteForm.role} onChange={(e) => setInviteForm({...inviteForm, role: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="RETAILER_STAFF">Staff</option>
                  <option value="RETAILER_OWNER">Owner</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Staff can manage orders and inventory. Owners have full access.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowInviteModal(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
