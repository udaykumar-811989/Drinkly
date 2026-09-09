'use client';

import { useState } from 'react';

interface ComplianceRule {
  id: string;
  name: string;
  type: 'MINIMUM_AGE' | 'DELIVERY_HOURS' | 'DRY_DAY' | 'RESTRICTED_LOCATION' | 'ORDER_LIMIT' | 'VERIFICATION_REQUIRED';
  description: string;
  jurisdiction: string;
  status: 'ACTIVE' | 'INACTIVE';
  value: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface DryDay {
  id: string;
  date: string;
  name: string;
  jurisdiction: string;
  isRecurring: boolean;
}

const mockRules: ComplianceRule[] = [
  { id: 'CR-001', name: 'Minimum Age Requirement', type: 'MINIMUM_AGE', description: 'All customers must be verified as 21+ before placing orders', jurisdiction: 'All', status: 'ACTIVE', value: '21', createdAt: '2025-06-01', updatedAt: '2025-06-01', createdBy: 'Admin System' },
  { id: 'CR-002', name: 'Delivery Hours - Maharashtra', type: 'DELIVERY_HOURS', description: 'Alcohol delivery allowed between 10:00 AM and 10:00 PM', jurisdiction: 'Maharashtra', status: 'ACTIVE', value: '10:00-22:00', createdAt: '2025-07-15', updatedAt: '2025-07-15', createdBy: 'Admin Priya' },
  { id: 'CR-003', name: 'Delivery Hours - Delhi', type: 'DELIVERY_HOURS', description: 'Alcohol delivery allowed between 10:00 AM and 8:00 PM', jurisdiction: 'Delhi', status: 'ACTIVE', value: '10:00-20:00', createdAt: '2025-07-15', updatedAt: '2025-07-15', createdBy: 'Admin Priya' },
  { id: 'CR-004', name: 'Maharashtra Dry Day - Independence Day', type: 'DRY_DAY', description: 'No alcohol sales on August 15th', jurisdiction: 'Maharashtra', status: 'ACTIVE', value: '2026-08-15', createdAt: '2025-01-01', updatedAt: '2025-01-01', createdBy: 'Admin System' },
  { id: 'CR-005', name: 'Maximum Order Value', type: 'ORDER_LIMIT', description: 'Maximum order value per transaction', jurisdiction: 'All', status: 'ACTIVE', value: '50000', createdAt: '2025-06-01', updatedAt: '2025-08-20', createdBy: 'Admin System' },
  { id: 'CR-006', name: 'Age Verification Required', type: 'VERIFICATION_REQUIRED', description: 'OTP-based age verification required for all orders', jurisdiction: 'All', status: 'ACTIVE', value: 'true', createdAt: '2025-06-01', updatedAt: '2025-06-01', createdBy: 'Admin System' },
  { id: 'CR-007', name: 'Restricted Zone - School Areas', type: 'RESTRICTED_LOCATION', description: 'No delivery within 500m of schools and colleges', jurisdiction: 'All', status: 'ACTIVE', value: '500m', createdAt: '2025-09-01', updatedAt: '2025-09-01', createdBy: 'Admin Raj' },
  { id: 'CR-008', name: 'Delivery Hours - Karnataka', type: 'DELIVERY_HOURS', description: 'Alcohol delivery allowed between 10:00 AM and 9:00 PM', jurisdiction: 'Karnataka', status: 'INACTIVE', value: '10:00-21:00', createdAt: '2025-08-01', updatedAt: '2025-08-01', createdBy: 'Admin Priya' },
];

const mockDryDays: DryDay[] = [
  { id: 'DD-001', date: '2026-01-26', name: 'Republic Day', jurisdiction: 'All', isRecurring: true },
  { id: 'DD-002', date: '2026-08-15', name: 'Independence Day', jurisdiction: 'Maharashtra', isRecurring: true },
  { id: 'DD-003', date: '2026-10-02', name: 'Gandhi Jayanti', jurisdiction: 'All', isRecurring: true },
  { id: 'DD-004', date: '2026-11-26', name: 'Constitution Day', jurisdiction: 'Delhi', isRecurring: true },
  { id: 'DD-005', date: '2026-12-25', name: 'Christmas', jurisdiction: 'All', isRecurring: true },
];

const ruleTypeColors: Record<string, string> = {
  MINIMUM_AGE: 'bg-blue-500/20 text-blue-400',
  DELIVERY_HOURS: 'bg-purple-500/20 text-purple-400',
  DRY_DAY: 'bg-red-500/20 text-red-400',
  RESTRICTED_LOCATION: 'bg-amber-500/20 text-amber-400',
  ORDER_LIMIT: 'bg-cyan-500/20 text-cyan-400',
  VERIFICATION_REQUIRED: 'bg-green-500/20 text-green-400',
};

const ruleTypes = [
  { value: 'MINIMUM_AGE', label: 'Minimum Age' },
  { value: 'DELIVERY_HOURS', label: 'Delivery Hours' },
  { value: 'DRY_DAY', label: 'Dry Day' },
  { value: 'RESTRICTED_LOCATION', label: 'Restricted Location' },
  { value: 'ORDER_LIMIT', label: 'Order Limit' },
  { value: 'VERIFICATION_REQUIRED', label: 'Verification Required' },
];

const jurisdictions = ['All', 'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Telangana'];

export default function CompliancePage() {
  const [rules, setRules] = useState(mockRules);
  const [dryDays, setDryDays] = useState(mockDryDays);
  const [activeTab, setActiveTab] = useState<'rules' | 'drydays'>('rules');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDryDayModal, setShowDryDayModal] = useState(false);
  const [newRule, setNewRule] = useState({ name: '', type: 'MINIMUM_AGE', description: '', jurisdiction: 'All', value: '' });
  const [newDryDay, setNewDryDay] = useState({ date: '', name: '', jurisdiction: 'All', isRecurring: true });

  const filteredRules = rules.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || r.type === typeFilter;
    const matchesJurisdiction = jurisdictionFilter === 'ALL' || r.jurisdiction === jurisdictionFilter;
    return matchesSearch && matchesType && matchesJurisdiction;
  });

  const filteredDryDays = dryDays.filter(d => {
    const matchesJurisdiction = jurisdictionFilter === 'ALL' || d.jurisdiction === jurisdictionFilter || d.jurisdiction === 'All';
    return matchesJurisdiction;
  });

  const handleAddRule = () => {
    const rule: ComplianceRule = {
      id: `CR-${String(rules.length + 1).padStart(3, '0')}`,
      ...newRule,
      status: 'ACTIVE',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'Admin User',
    };
    setRules(prev => [...prev, rule]);
    setShowAddModal(false);
    setNewRule({ name: '', type: 'MINIMUM_AGE', description: '', jurisdiction: 'All', value: '' });
  };

  const handleAddDryDay = () => {
    const dd: DryDay = {
      id: `DD-${String(dryDays.length + 1).padStart(3, '0')}`,
      ...newDryDay,
    };
    setDryDays(prev => [...prev, dd]);
    setShowDryDayModal(false);
    setNewDryDay({ date: '', name: '', jurisdiction: 'All', isRecurring: true });
  };

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(r => r.id === ruleId ? { ...r, status: r.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : r));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Compliance Management</h2>
          <p className="text-gray-400 text-sm mt-1">Manage compliance rules, dry days, and restrictions</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('rules')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'rules' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
          Compliance Rules ({rules.length})
        </button>
        <button onClick={() => setActiveTab('drydays')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'drydays' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}>
          Dry Day Calendar ({dryDays.length})
        </button>
      </div>

      {activeTab === 'rules' && (
        <>
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input type="text" placeholder="Search rules..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              <option value="ALL">All Types</option>
              {ruleTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <select value={jurisdictionFilter} onChange={e => setJurisdictionFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              <option value="ALL">All Jurisdictions</option>
              {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <button onClick={() => setShowAddModal(true)} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
              + Add Rule
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Rule</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Jurisdiction</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Value</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Updated</th>
                    <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {filteredRules.map(rule => (
                    <tr key={rule.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-white text-sm font-medium">{rule.name}</p>
                        <p className="text-gray-500 text-xs truncate max-w-xs">{rule.description}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${ruleTypeColors[rule.type]}`}>
                          {rule.type.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-300 text-sm">{rule.jurisdiction}</td>
                      <td className="px-5 py-4 text-gray-300 text-sm font-mono">{rule.value}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${rule.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {rule.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-500 text-xs">{rule.updatedAt}</td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => toggleRuleStatus(rule.id)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${rule.status === 'ACTIVE' ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                          {rule.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'drydays' && (
        <>
          <div className="flex flex-col lg:flex-row gap-3">
            <select value={jurisdictionFilter} onChange={e => setJurisdictionFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
              <option value="ALL">All Jurisdictions</option>
              {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
            </select>
            <button onClick={() => setShowDryDayModal(true)} className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
              + Add Dry Day
            </button>
          </div>

          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Name</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Jurisdiction</th>
                    <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Recurring</th>
                    <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700/30">
                  {filteredDryDays.map(dd => (
                    <tr key={dd.id} className="hover:bg-gray-700/20 transition-colors">
                      <td className="px-5 py-4 text-white text-sm font-medium">{dd.date}</td>
                      <td className="px-5 py-4 text-gray-300 text-sm">{dd.name}</td>
                      <td className="px-5 py-4 text-gray-300 text-sm">{dd.jurisdiction}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${dd.isRecurring ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                          {dd.isRecurring ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button onClick={() => setDryDays(prev => prev.filter(d => d.id !== dd.id))} className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-xs font-medium transition-colors">
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-4">Add Compliance Rule</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Rule Name</label>
                <input type="text" value={newRule.name} onChange={e => setNewRule(prev => ({ ...prev, name: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Type</label>
                <select value={newRule.type} onChange={e => setNewRule(prev => ({ ...prev, type: e.target.value as any }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  {ruleTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Description</label>
                <textarea value={newRule.description} onChange={e => setNewRule(prev => ({ ...prev, description: e.target.value }))} rows={3} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm">Jurisdiction</label>
                  <select value={newRule.jurisdiction} onChange={e => setNewRule(prev => ({ ...prev, jurisdiction: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Value</label>
                  <input type="text" value={newRule.value} onChange={e => setNewRule(prev => ({ ...prev, value: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleAddRule} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">Add Rule</button>
            </div>
          </div>
        </div>
      )}

      {showDryDayModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowDryDayModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-4">Add Dry Day</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm">Date</label>
                <input type="date" value={newDryDay.date} onChange={e => setNewDryDay(prev => ({ ...prev, date: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Name</label>
                <input type="text" value={newDryDay.name} onChange={e => setNewDryDay(prev => ({ ...prev, name: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-gray-400 text-sm">Jurisdiction</label>
                <select value={newDryDay.jurisdiction} onChange={e => setNewDryDay(prev => ({ ...prev, jurisdiction: e.target.value }))} className="w-full mt-1 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  {jurisdictions.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={newDryDay.isRecurring} onChange={e => setNewDryDay(prev => ({ ...prev, isRecurring: e.target.checked }))} className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-emerald-500 focus:ring-emerald-500" />
                <label className="text-gray-400 text-sm">Recurring annually</label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDryDayModal(false)} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">Cancel</button>
              <button onClick={handleAddDryDay} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">Add Dry Day</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
