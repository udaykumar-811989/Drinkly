'use client';

import React, { useState } from 'react';

const defaultHours = [
  { day: 'Monday', open: '09:00', close: '22:00', enabled: true },
  { day: 'Tuesday', open: '09:00', close: '22:00', enabled: true },
  { day: 'Wednesday', open: '09:00', close: '22:00', enabled: true },
  { day: 'Thursday', open: '09:00', close: '23:00', enabled: true },
  { day: 'Friday', open: '09:00', close: '00:00', enabled: true },
  { day: 'Saturday', open: '10:00', close: '00:00', enabled: true },
  { day: 'Sunday', open: '10:00', close: '21:00', enabled: true },
];

export default function RetailerSettings() {
  const [storeInfo, setStoreInfo] = useState({
    name: 'The Whiskey Warehouse',
    description: 'Premium spirits and fine wines delivered to your door.',
    phone: '+44 20 7946 0958',
    email: 'hello@whiskeywarehouse.com',
    address: '42 Mayfair Lane, London, W1K 4QS',
  });

  const [deliverySettings, setDeliverySettings] = useState({
    radius: '5',
    minimumOrder: '25',
    estimatedTime: '30',
    freeDeliveryThreshold: '50',
    deliveryFee: '3.99',
  });

  const [operatingHours, setOperatingHours] = useState(defaultHours);
  const [storeOpen, setStoreOpen] = useState(true);
  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    licenceExpiry: true,
    staffActivity: false,
    dailyReport: true,
    emailNotifications: true,
    smsNotifications: false,
  });
  const [bankInfo, setBankInfo] = useState({
    accountName: 'The Whiskey Warehouse Ltd',
    sortCode: '12-34-56',
    accountNumber: '****7890',
    taxId: 'GB123456789',
  });
  const [saving, setSaving] = useState(false);

  const toggleHours = (index: number) => {
    setOperatingHours(prev => prev.map((h, i) => i === index ? { ...h, enabled: !h.enabled } : h));
  };

  const updateHours = (index: number, field: 'open' | 'close', value: string) => {
    setOperatingHours(prev => prev.map((h, i) => i === index ? { ...h, [field]: value } : h));
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store configuration and preferences</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-medium rounded-xl hover:bg-purple-700 transition-colors shadow-sm disabled:opacity-50">
          {saving ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Store Status:</span>
          <button onClick={() => setStoreOpen(!storeOpen)} className={`relative w-12 h-6 rounded-full transition-colors ${storeOpen ? 'bg-emerald-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${storeOpen ? 'translate-x-6' : ''}`} />
          </button>
          <span className={`text-sm font-semibold ${storeOpen ? 'text-emerald-600' : 'text-gray-500'}`}>
            {storeOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="h-6 w-px bg-gray-200" />
        <p className="text-xs text-gray-500">When closed, customers cannot place orders from your store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Store Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
              <input type="text" value={storeInfo.name} onChange={(e) => setStoreInfo({...storeInfo, name: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={storeInfo.description} onChange={(e) => setStoreInfo({...storeInfo, description: e.target.value})} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" value={storeInfo.phone} onChange={(e) => setStoreInfo({...storeInfo, phone: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" value={storeInfo.email} onChange={(e) => setStoreInfo({...storeInfo, email: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" value={storeInfo.address} onChange={(e) => setStoreInfo({...storeInfo, address: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Delivery Settings</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Radius (km)</label>
                <input type="number" value={deliverySettings.radius} onChange={(e) => setDeliverySettings({...deliverySettings, radius: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min. Order (£)</label>
                <input type="number" value={deliverySettings.minimumOrder} onChange={(e) => setDeliverySettings({...deliverySettings, minimumOrder: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Est. Delivery (min)</label>
                <input type="number" value={deliverySettings.estimatedTime} onChange={(e) => setDeliverySettings({...deliverySettings, estimatedTime: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Free Delivery (£)</label>
                <input type="number" value={deliverySettings.freeDeliveryThreshold} onChange={(e) => setDeliverySettings({...deliverySettings, freeDeliveryThreshold: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (£)</label>
              <input type="number" step="0.01" value={deliverySettings.deliveryFee} onChange={(e) => setDeliverySettings({...deliverySettings, deliveryFee: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Operating Hours</h2>
        <div className="space-y-3">
          {operatingHours.map((schedule, i) => (
            <div key={schedule.day} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <label className="flex items-center gap-3 w-32">
                <input type="checkbox" checked={schedule.enabled} onChange={() => toggleHours(i)} className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                <span className={`text-sm font-medium ${schedule.enabled ? 'text-gray-900' : 'text-gray-400'}`}>{schedule.day}</span>
              </label>
              {schedule.enabled ? (
                <div className="flex items-center gap-2">
                  <input type="time" value={schedule.open} onChange={(e) => updateHours(i, 'open', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                  <span className="text-gray-400">to</span>
                  <input type="time" value={schedule.close} onChange={(e) => updateHours(i, 'close', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                </div>
              ) : (
                <span className="text-sm text-gray-400">Closed</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            {[
              { key: 'newOrders', label: 'New Order Alerts', desc: 'Get notified when a new order arrives' },
              { key: 'lowStock', label: 'Low Stock Warnings', desc: 'Alert when products fall below minimum stock' },
              { key: 'licenceExpiry', label: 'Licence Expiry Reminders', desc: 'Reminders before licence expires' },
              { key: 'staffActivity', label: 'Staff Activity', desc: 'Notifications about staff actions' },
              { key: 'dailyReport', label: 'Daily Reports', desc: 'Receive daily business summary' },
              { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send notifications via email' },
              { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send notifications via SMS' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                  className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-purple-500' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Payout Information</h2>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
              <p className="text-sm font-medium text-amber-800">This information is encrypted and secure.</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
              <input type="text" value={bankInfo.accountName} onChange={(e) => setBankInfo({...bankInfo, accountName: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Code</label>
                <input type="text" value={bankInfo.sortCode} onChange={(e) => setBankInfo({...bankInfo, sortCode: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                <input type="text" value={bankInfo.accountNumber} onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tax ID / VAT Number</label>
              <input type="text" value={bankInfo.taxId} onChange={(e) => setBankInfo({...bankInfo, taxId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
            </div>
            <p className="text-xs text-gray-400">Payouts are processed weekly every Monday.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
