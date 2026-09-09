'use client';

import { useState } from 'react';

interface AuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

const mockLogs: AuditLog[] = [
  { id: 'LOG-001', actor: 'Admin Priya', actorRole: 'SUPER_ADMIN', action: 'APPROVE_RETAILER', entityType: 'Retailer', entityId: 'RT-1008', details: 'Approved retailer The Barrel House', ipAddress: '192.168.1.100', timestamp: '2026-09-09 14:30:15' },
  { id: 'LOG-002', actor: 'System', actorRole: 'SYSTEM', action: 'PROCESS_REFUND', entityType: 'Order', entityId: 'ORD-10003', details: 'Auto-processed refund of $45.00', ipAddress: 'N/A', timestamp: '2026-09-09 09:30:00' },
  { id: 'LOG-003', actor: 'Admin Raj', actorRole: 'ADMIN', action: 'SUSPEND_AGENT', entityType: 'Agent', entityId: 'AG-1004', details: 'Suspended delivery agent Deepak Nair - customer complaints', ipAddress: '192.168.1.101', timestamp: '2026-09-09 13:15:42' },
  { id: 'LOG-004', actor: 'Admin Priya', actorRole: 'SUPER_ADMIN', action: 'UPDATE_COMPLIANCE', entityType: 'Compliance Rule', entityId: 'CR-002', details: 'Updated delivery hours for Maharashtra to 10:00-22:00', ipAddress: '192.168.1.100', timestamp: '2026-09-09 12:00:30' },
  { id: 'LOG-005', actor: 'Retailer #RT-1001', actorRole: 'RETAILER', action: 'UPLOAD_LICENCE', entityType: 'Licence', entityId: 'LIC-1009', details: 'Uploaded new licence document LIC-MH-2026-7890', ipAddress: '10.0.0.50', timestamp: '2026-09-09 11:45:20' },
  { id: 'LOG-006', actor: 'Admin System', actorRole: 'SYSTEM', action: 'BLOCK_USER', entityType: 'User', entityId: 'USR-432', details: 'Auto-blocked user after 5 failed login attempts', ipAddress: 'N/A', timestamp: '2026-09-09 10:20:15' },
  { id: 'LOG-007', actor: 'Admin Raj', actorRole: 'ADMIN', action: 'APPROVE_PRODUCT', entityType: 'Product', entityId: 'PRD-1009', details: 'Approved product Kingfisher Premium from Beer Barn', ipAddress: '192.168.1.101', timestamp: '2026-09-09 09:55:10' },
  { id: 'LOG-008', actor: 'Admin Priya', actorRole: 'SUPER_ADMIN', action: 'UPDATE_SETTINGS', entityType: 'System Settings', entityId: 'SETTINGS', details: 'Updated platform fee from 4% to 5%', ipAddress: '192.168.1.100', timestamp: '2026-09-09 09:00:00' },
  { id: 'LOG-009', actor: 'System', actorRole: 'SYSTEM', action: 'EXPIRE_LICENCE', entityType: 'Licence', entityId: 'LIC-1004', details: 'Licence expired for Premium Spirits - account suspended', ipAddress: 'N/A', timestamp: '2026-09-08 00:00:00' },
  { id: 'LOG-010', actor: 'Admin Raj', actorRole: 'ADMIN', action: 'CANCEL_ORDER', entityType: 'Order', entityId: 'ORD-10015', details: 'Admin override - cancelled order #DL-78446', ipAddress: '192.168.1.101', timestamp: '2026-09-08 16:30:45' },
];

const actionColors: Record<string, string> = {
  APPROVE_RETAILER: 'bg-green-500/20 text-green-400',
  PROCESS_REFUND: 'bg-cyan-500/20 text-cyan-400',
  SUSPEND_AGENT: 'bg-amber-500/20 text-amber-400',
  UPDATE_COMPLIANCE: 'bg-blue-500/20 text-blue-400',
  UPLOAD_LICENCE: 'bg-purple-500/20 text-purple-400',
  BLOCK_USER: 'bg-red-500/20 text-red-400',
  APPROVE_PRODUCT: 'bg-green-500/20 text-green-400',
  UPDATE_SETTINGS: 'bg-gray-500/20 text-gray-400',
  EXPIRE_LICENCE: 'bg-red-500/20 text-red-400',
  CANCEL_ORDER: 'bg-amber-500/20 text-amber-400',
};

const actionTypes = ['All', 'APPROVE_RETAILER', 'PROCESS_REFUND', 'SUSPEND_AGENT', 'UPDATE_COMPLIANCE', 'UPLOAD_LICENCE', 'BLOCK_USER', 'APPROVE_PRODUCT', 'UPDATE_SETTINGS', 'EXPIRE_LICENCE', 'CANCEL_ORDER'];
const entityTypes = ['All', 'Retailer', 'Order', 'Agent', 'Compliance Rule', 'Licence', 'User', 'Product', 'System Settings'];

export default function AuditLogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('All');
  const [entityFilter, setEntityFilter] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const filtered = logs.filter(l => {
    const matchesSearch = l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.entityId.toLowerCase().includes(search.toLowerCase()) ||
      l.details.toLowerCase().includes(search.toLowerCase()) ||
      l.id.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === 'All' || l.action === actionFilter;
    const matchesEntity = entityFilter === 'All' || l.entityType === entityFilter;
    return matchesSearch && matchesAction && matchesEntity;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Audit Logs</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} log entries</p>
        </div>
        <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
          📥 Export Logs
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input type="text" placeholder="Search by actor, entity, or details..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors" />
        </div>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
          {actionTypes.map(a => <option key={a} value={a}>{a === 'All' ? 'All Actions' : a.replace(/_/g, ' ')}</option>)}
        </select>
        <select value={entityFilter} onChange={e => setEntityFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500">
          {entityTypes.map(e => <option key={e} value={e}>{e === 'All' ? 'All Entities' : e}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
      </div>

      <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Timestamp</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Actor</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Action</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Entity</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">Details</th>
                <th className="text-left px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider">IP</th>
                <th className="text-right px-5 py-3 text-gray-400 text-xs font-medium uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/30">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-700/20 transition-colors cursor-pointer" onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}>
                  <td className="px-5 py-4 text-gray-500 text-xs font-mono whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-5 py-4">
                    <p className="text-white text-sm">{log.actor}</p>
                    <p className="text-gray-500 text-xs">{log.actorRole}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-gray-500/20 text-gray-400'}`}>
                      {log.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-gray-300 text-sm">{log.entityType}</p>
                    <p className="text-gray-500 text-xs font-mono">{log.entityId}</p>
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-sm max-w-xs truncate">{log.details}</td>
                  <td className="px-5 py-4 text-gray-500 text-xs font-mono">{log.ipAddress}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-gray-500 text-xs">{expandedLog === log.id ? '▼' : '▶'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {expandedLog && (
          <div className="border-t border-gray-700/50 p-5 bg-gray-900/50">
            {(() => {
              const log = logs.find(l => l.id === expandedLog);
              if (!log) return null;
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div><p className="text-gray-400 text-xs">Log ID</p><p className="text-white text-sm font-mono mt-1">{log.id}</p></div>
                  <div><p className="text-gray-400 text-xs">Actor</p><p className="text-white text-sm mt-1">{log.actor}</p></div>
                  <div><p className="text-gray-400 text-xs">Role</p><p className="text-white text-sm mt-1">{log.actorRole}</p></div>
                  <div><p className="text-gray-400 text-xs">IP Address</p><p className="text-white text-sm font-mono mt-1">{log.ipAddress}</p></div>
                  <div className="col-span-2 md:col-span-4"><p className="text-gray-400 text-xs">Full Details</p><p className="text-white text-sm mt-1">{log.details}</p></div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
