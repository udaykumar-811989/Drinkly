'use client';

import React, { useState, useMemo } from 'react';

const initialInventory = [
  { id: 1, name: 'Jameson Irish Whiskey', sku: 'WHS-001', category: 'Whiskey', stock: 45, minStock: 10, cost: 18.00, price: 35.00, lastUpdated: '2024-01-15' },
  { id: 2, name: 'Jack Daniel\'s Tennessee', sku: 'WHS-002', category: 'Whiskey', stock: 38, minStock: 15, cost: 14.00, price: 28.00, lastUpdated: '2024-01-15' },
  { id: 3, name: 'Grey Goose Vodka', sku: 'VOD-001', category: 'Vodka', stock: 22, minStock: 8, cost: 22.00, price: 42.00, lastUpdated: '2024-01-14' },
  { id: 4, name: 'Moët & Chandon', sku: 'CHM-001', category: 'Champagne', stock: 15, minStock: 5, cost: 25.00, price: 45.00, lastUpdated: '2024-01-14' },
  { id: 5, name: 'Hendricks Gin', sku: 'GIN-001', category: 'Gin', stock: 30, minStock: 10, cost: 16.00, price: 32.00, lastUpdated: '2024-01-13' },
  { id: 6, name: 'Bacardi Rum', sku: 'RUM-001', category: 'Rum', stock: 50, minStock: 15, cost: 11.00, price: 22.00, lastUpdated: '2024-01-13' },
  { id: 7, name: 'Absolut Vodka', sku: 'VOD-002', category: 'Vodka', stock: 0, minStock: 10, cost: 12.00, price: 25.00, lastUpdated: '2024-01-10' },
  { id: 8, name: 'Tequila Rose', sku: 'LQN-001', category: 'Liqueur', stock: 40, minStock: 12, cost: 9.00, price: 18.00, lastUpdated: '2024-01-12' },
  { id: 9, name: 'Coca-Cola', sku: 'MXR-001', category: 'Mixer', stock: 120, minStock: 30, cost: 0.80, price: 2.50, lastUpdated: '2024-01-15' },
  { id: 10, name: 'Tonic Water', sku: 'MXR-002', category: 'Mixer', stock: 85, minStock: 25, cost: 1.20, price: 3.00, lastUpdated: '2024-01-15' },
  { id: 11, name: 'Limes', sku: 'MXR-003', category: 'Mixer', stock: 3, minStock: 20, cost: 0.30, price: 1.50, lastUpdated: '2024-01-11' },
  { id: 12, name: 'Plastic Flutes', sku: 'ACC-001', category: 'Accessories', stock: 200, minStock: 50, cost: 0.20, price: 1.00, lastUpdated: '2024-01-15' },
];

const stockHistory = [
  { date: '2024-01-15', product: 'Coca-Cola', type: 'Restock', qty: 50, by: 'John Doe' },
  { date: '2024-01-15', product: 'Jameson Whiskey', type: 'Sale', qty: -3, by: 'System' },
  { date: '2024-01-14', product: 'Grey Goose', type: 'Adjustment', qty: -2, by: 'Sarah M.' },
  { date: '2024-01-14', product: 'Moët & Chandon', type: 'Restock', qty: 10, by: 'John Doe' },
  { date: '2024-01-13', product: 'Limes', type: 'Sale', qty: -7, by: 'System' },
];

export default function RetailerInventory() {
  const [inventory, setInventory] = useState(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingStock, setEditingStock] = useState<number | null>(null);
  const [newStockValue, setNewStockValue] = useState('');
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkAmount, setBulkAmount] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' };
    if (stock <= minStock) return { label: 'Low Stock', color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
    return { label: 'In Stock', color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
  };

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const status = getStockStatus(item.stock, item.minStock);
      const matchesFilter = filterStatus === 'all' ||
        (filterStatus === 'low' && item.stock > 0 && item.stock <= item.minStock) ||
        (filterStatus === 'out' && item.stock === 0) ||
        (filterStatus === 'in' && item.stock > item.minStock);
      return matchesSearch && matchesFilter;
    });
  }, [inventory, searchQuery, filterStatus]);

  const updateStock = (id: number, newStock: number) => {
    setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: newStock, lastUpdated: new Date().toISOString().split('T')[0] } : item));
    setEditingStock(null);
  };

  const bulkUpdate = () => {
    const amount = parseInt(bulkAmount);
    if (isNaN(amount)) return;
    setInventory(prev => prev.map(item => selectedItems.includes(item.id) ? { ...item, stock: Math.max(0, item.stock + amount), lastUpdated: new Date().toISOString().split('T')[0] } : item));
    setSelectedItems([]);
    setShowBulkUpdate(false);
    setBulkAmount('');
  };

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.cost, 0);
  const lowStockCount = inventory.filter(i => i.stock > 0 && i.stock <= i.minStock).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage stock levels</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowHistory(!showHistory)} className="px-4 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
            Stock History
          </button>
          {selectedItems.length > 0 && (
            <button onClick={() => setShowBulkUpdate(true)} className="px-4 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">
              Bulk Update ({selectedItems.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Total Inventory Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">£{totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{lowStockCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{outOfStockCount}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <div className="flex gap-2">
          {['all', 'in', 'low', 'out'].map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)} className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors ${filterStatus === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
              {f === 'all' ? 'All' : f === 'in' ? 'In Stock' : f === 'low' ? 'Low Stock' : 'Out of Stock'}
            </button>
          ))}
        </div>
      </div>

      {showHistory && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Stock History</h2>
            <button onClick={() => setShowHistory(false)} className="text-sm text-gray-400 hover:text-gray-600">Close</button>
          </div>
          <div className="divide-y divide-gray-50">
            {stockHistory.map((entry, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${entry.type === 'Restock' ? 'bg-emerald-100' : entry.type === 'Sale' ? 'bg-blue-100' : 'bg-amber-100'}`}>
                    <span className="text-sm">{entry.type === 'Restock' ? '📦' : entry.type === 'Sale' ? '🛒' : '✏️'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.product}</p>
                    <p className="text-xs text-gray-500">{entry.date} &middot; {entry.by}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-semibold ${entry.qty > 0 ? 'text-emerald-600' : 'text-red-600'}`}>{entry.qty > 0 ? '+' : ''}{entry.qty}</span>
                  <p className="text-xs text-gray-400">{entry.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4"><input type="checkbox" checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0} onChange={() => setSelectedItems(selectedItems.length === filteredInventory.length ? [] : filteredInventory.map(i => i.id))} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /></th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Stock</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                <th className="text-right p-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInventory.map((item) => {
                const status = getStockStatus(item.stock, item.minStock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50">
                    <td className="p-4"><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItemSelection(item.id)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" /></td>
                    <td className="p-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="p-4 text-xs text-gray-500 font-mono">{item.sku}</td>
                    <td className="p-4"><span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">{item.category}</span></td>
                    <td className="p-4">
                      {editingStock === item.id ? (
                        <div className="flex items-center gap-2">
                          <input type="number" value={newStockValue} onChange={(e) => setNewStockValue(e.target.value)} className="w-20 px-2 py-1 border border-gray-200 rounded-lg text-sm" autoFocus />
                          <button onClick={() => updateStock(item.id, parseInt(newStockValue) || 0)} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg></button>
                          <button onClick={() => setEditingStock(null)} className="p-1 text-gray-400 hover:bg-gray-50 rounded"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button>
                        </div>
                      ) : (
                        <span className={`text-sm font-semibold ${status.color}`}>{item.stock}</span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-500">{item.minStock}</td>
                    <td className="p-4"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}><span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />{status.label}</span></td>
                    <td className="p-4 text-sm text-gray-600">£{(item.stock * item.cost).toFixed(2)}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => { setEditingStock(item.id); setNewStockValue(String(item.stock)); }} className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Edit stock">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showBulkUpdate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Bulk Stock Update</h2>
              <p className="text-sm text-gray-500 mt-1">{selectedItems.length} items selected</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adjustment Amount</label>
                <input type="number" value={bulkAmount} onChange={(e) => setBulkAmount(e.target.value)} placeholder="Use negative to subtract" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                <p className="text-xs text-gray-400 mt-1">Positive to restock, negative to reduce</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowBulkUpdate(false)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
                <button onClick={bulkUpdate} className="flex-1 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors">Apply Update</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
