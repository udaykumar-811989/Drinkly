'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  retailerName: string;
  retailerId: string;
  category: string;
  price: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'PROHIBITED';
  stock: number;
  image?: string;
  description: string;
  alcoholContent: string;
  volume: string;
  totalOrders: number;
  rating: number;
}

const mockProducts: Product[] = [
  { id: 'PRD-1001', name: 'Johnnie Walker Black Label', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', category: 'Whisky', price: '$45.00', status: 'ACTIVE', stock: 120, description: 'Premium blended Scotch whisky', alcoholContent: '40%', volume: '750ml', totalOrders: 456, rating: 4.7 },
  { id: 'PRD-1002', name: 'Absolut Vodka', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', category: 'Vodka', price: '$32.00', status: 'ACTIVE', stock: 89, description: 'Classic Swedish vodka', alcoholContent: '40%', volume: '750ml', totalOrders: 321, rating: 4.5 },
  { id: 'PRD-1003', name: 'Heineken Beer', retailerName: 'Beer Barn', retailerId: 'RT-1005', category: 'Beer', price: '$3.50', status: 'ACTIVE', stock: 500, description: 'Premium lager beer', alcoholContent: '5%', volume: '330ml', totalOrders: 1234, rating: 4.3 },
  { id: 'PRD-1004', name: 'Moët & Chandon', retailerName: 'Wine Palace', retailerId: 'RT-1003', category: 'Champagne', price: '$67.00', status: 'PENDING', stock: 45, description: 'French champagne', alcoholContent: '12%', volume: '750ml', totalOrders: 89, rating: 4.8 },
  { id: 'PRD-1005', name: 'Kingfisher Ultra', retailerName: 'City Spirits', retailerId: 'RT-1002', category: 'Beer', price: '$2.50', status: 'SUSPENDED', stock: 300, description: 'Indian premium lager', alcoholContent: '5%', volume: '500ml', totalOrders: 678, rating: 4.1 },
  { id: 'PRD-1006', name: 'Martini Rosso', retailerName: 'Premium Spirits', retailerId: 'RT-1004', category: 'Vermouth', price: '$18.00', status: 'PROHIBITED', stock: 0, description: 'Italian vermouth', alcoholContent: '15%', volume: '1000ml', totalOrders: 0, rating: 0 },
  { id: 'PRD-1007', name: 'Chivas Regal 12', retailerName: 'Metro Wine Shop', retailerId: 'RT-1001', category: 'Whisky', price: '$52.00', status: 'ACTIVE', stock: 67, description: 'Blended Scotch whisky', alcoholContent: '40%', volume: '750ml', totalOrders: 234, rating: 4.6 },
  { id: 'PRD-1008', name: 'Sula Vineyards Shiraz', retailerName: 'Wine Palace', retailerId: 'RT-1003', category: 'Wine', price: '$15.00', status: 'ACTIVE', stock: 150, description: 'Indian red wine', alcoholContent: '13.5%', volume: '750ml', totalOrders: 189, rating: 4.2 },
];

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  ACTIVE: 'bg-green-500/20 text-green-400 border-green-500/30',
  SUSPENDED: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  PROHIBITED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const categories = ['All', 'Whisky', 'Vodka', 'Beer', 'Wine', 'Champagne', 'Vermouth', 'Rum', 'Gin'];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [retailerFilter, setRetailerFilter] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'activate' | 'suspend' | 'prohibit'>('activate');

  const retailers = [...new Set(products.map(p => p.retailerName))];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.retailerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesRetailer = retailerFilter === 'ALL' || p.retailerName === retailerFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesRetailer;
  });

  const handleAction = (productId: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? {
        ...p,
        status: actionType === 'activate' ? 'ACTIVE' : actionType === 'suspend' ? 'SUSPENDED' : 'PROHIBITED',
      } : p
    ));
    setShowActionModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Product Management</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} products found</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by product name, ID, or retailer..."
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
          <option value="ACTIVE">Active</option>
          <option value="PENDING">Pending</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="PROHIBITED">Prohibited</option>
        </select>
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={retailerFilter}
          onChange={e => setRetailerFilter(e.target.value)}
          className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="ALL">All Retailers</option>
          {retailers.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(product => (
          <div key={product.id} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 hover:border-gray-600 transition-colors cursor-pointer" onClick={() => setSelectedProduct(product)}>
            <div className="flex items-start justify-between mb-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[product.status]}`}>
                {product.status}
              </span>
              <span className="text-gray-500 text-xs">{product.id}</span>
            </div>
            <div className="w-full h-32 bg-gray-700/30 rounded-lg mb-3 flex items-center justify-center text-4xl">
              {product.category === 'Beer' ? '🍺' : product.category === 'Wine' ? '🍷' : product.category === 'Champagne' ? '🥂' : product.category === 'Vodka' ? '🍸' : '🥃'}
            </div>
            <h3 className="text-white font-medium text-sm line-clamp-1">{product.name}</h3>
            <p className="text-gray-400 text-xs mt-1">{product.retailerName}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-emerald-400 font-semibold">{product.price}</span>
              <div className="flex items-center gap-1">
                <span className="text-amber-400 text-xs">★</span>
                <span className="text-gray-300 text-xs">{product.rating || 'N/A'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>{product.stock} in stock</span>
              <span>{product.totalOrders} orders</span>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && !showActionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-700/50 flex items-center justify-between">
              <h3 className="text-white font-semibold text-lg">Product Details</h3>
              <button onClick={() => setSelectedProduct(null)} className="text-gray-400 hover:text-white text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-700/30 rounded-xl flex items-center justify-center text-3xl">
                  {selectedProduct.category === 'Beer' ? '🍺' : selectedProduct.category === 'Wine' ? '🍷' : selectedProduct.category === 'Champagne' ? '🥂' : selectedProduct.category === 'Vodka' ? '🍸' : '🥃'}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-lg">{selectedProduct.name}</p>
                  <p className="text-gray-400 text-sm">{selectedProduct.id} • {selectedProduct.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[selectedProduct.status]}`}>
                  {selectedProduct.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Retailer</p>
                  <p className="text-white text-sm mt-1">{selectedProduct.retailerName}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Price</p>
                  <p className="text-emerald-400 text-sm mt-1 font-semibold">{selectedProduct.price}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Alcohol Content</p>
                  <p className="text-white text-sm mt-1">{selectedProduct.alcoholContent}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Volume</p>
                  <p className="text-white text-sm mt-1">{selectedProduct.volume}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Stock</p>
                  <p className="text-white text-sm mt-1">{selectedProduct.stock} units</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Total Orders</p>
                  <p className="text-white text-sm mt-1">{selectedProduct.totalOrders}</p>
                </div>
                <div className="bg-gray-700/30 rounded-lg p-3 col-span-2">
                  <p className="text-gray-400 text-xs">Description</p>
                  <p className="text-white text-sm mt-1">{selectedProduct.description}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                {selectedProduct.status !== 'ACTIVE' && (
                  <button
                    onClick={() => { setActionType('activate'); setShowActionModal(true); }}
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Approve Product
                  </button>
                )}
                {selectedProduct.status === 'ACTIVE' && (
                  <button
                    onClick={() => { setActionType('suspend'); setShowActionModal(true); }}
                    className="flex-1 py-2.5 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Suspend Product
                  </button>
                )}
                {selectedProduct.status !== 'PROHIBITED' && (
                  <button
                    onClick={() => { setActionType('prohibit'); setShowActionModal(true); }}
                    className="flex-1 py-2.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Prohibit Product
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showActionModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowActionModal(false)}>
          <div className="bg-gray-800 border border-gray-700 rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-white font-semibold text-lg mb-2">
              {actionType === 'activate' ? 'Approve Product' : actionType === 'suspend' ? 'Suspend Product' : 'Prohibit Product'}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {actionType === 'activate'
                ? `Approve "${selectedProduct.name}" to be listed on the platform?`
                : actionType === 'suspend'
                ? `Suspend "${selectedProduct.name}"? It will be hidden from customers.`
                : `Prohibit "${selectedProduct.name}"? This product will be permanently blocked from the platform.`
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
                onClick={() => handleAction(selectedProduct.id)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  actionType === 'activate' ? 'bg-green-500 hover:bg-green-600 text-white' :
                  actionType === 'suspend' ? 'bg-amber-500 hover:bg-amber-600 text-white' :
                  'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {actionType === 'activate' ? 'Approve' : actionType === 'suspend' ? 'Suspend' : 'Prohibit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
