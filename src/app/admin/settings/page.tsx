'use client';

import { useState } from 'react';

interface SettingsSection {
  id: string;
  label: string;
  icon: string;
  requiresSuperAdmin?: boolean;
}

const sections: SettingsSection[] = [
  { id: 'jurisdictions', label: 'Jurisdictions', icon: '🗺️' },
  { id: 'age', label: 'Age Configuration', icon: '🔞' },
  { id: 'delivery', label: 'Delivery Settings', icon: '🚚' },
  { id: 'fees', label: 'Platform Fees', icon: '💵' },
  { id: 'tax', label: 'Tax Configuration', icon: '🧾' },
  { id: 'payments', label: 'Payment Providers', icon: '💳' },
  { id: 'maps', label: 'Map Provider', icon: '📍' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'maintenance', label: 'Maintenance Mode', icon: '🔧', requiresSuperAdmin: true },
];

const [jurisdictions, setJurisdictions] = useState('');

const defaultJurisdictions = [
  { id: '1', name: 'Maharashtra', enabled: true, deliveryHours: '10:00-22:00', minimumAge: 21 },
  { id: '2', name: 'Delhi', enabled: true, deliveryHours: '10:00-20:00', minimumAge: 21 },
  { id: '3', name: 'Karnataka', enabled: true, deliveryHours: '10:00-21:00', minimumAge: 21 },
  { id: '4', name: 'Tamil Nadu', enabled: false, deliveryHours: '10:00-20:00', minimumAge: 21 },
  { id: '5', name: 'West Bengal', enabled: true, deliveryHours: '10:00-21:00', minimumAge: 21 },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('jurisdictions');
  const [userRole] = useState<'ADMIN' | 'SUPER_ADMIN'>('SUPER_ADMIN');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const [config, setConfig] = useState({
    minimumAge: 21,
    deliveryStartHour: '10:00',
    deliveryEndHour: '22:00',
    maxOrderValue: 50000,
    platformFeePercent: 5,
    deliveryFee: 49,
    gstPercent: 18,
    paymentProviders: { razorpay: true, stripe: true, cod: true },
    mapProvider: 'google',
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">System Settings</h2>
          <p className="text-gray-400 text-sm mt-1">Configure platform settings and preferences</p>
        </div>
        <button onClick={handleSave} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors">
          {saved ? '✓ Saved!' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-2 space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                disabled={section.requiresSuperAdmin && userRole !== 'SUPER_ADMIN'}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                  ${activeSection === section.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-gray-400 hover:text-white hover:bg-gray-700/50'}
                  ${section.requiresSuperAdmin && userRole !== 'SUPER_ADMIN' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span>{section.icon}</span>
                <span>{section.label}</span>
                {section.requiresSuperAdmin && <span className="ml-auto text-xs text-amber-400">🔒</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {activeSection === 'jurisdictions' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Supported Jurisdictions</h3>
              <div className="space-y-3">
                {defaultJurisdictions.map(j => (
                  <div key={j.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${j.enabled ? 'bg-green-400' : 'bg-gray-500'}`} />
                      <div>
                        <p className="text-white font-medium">{j.name}</p>
                        <p className="text-gray-400 text-xs">Delivery: {j.deliveryHours} • Min Age: {j.minimumAge}</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${j.enabled ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}>
                      {j.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'age' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Age Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm">Minimum Age for Alcohol Purchase</label>
                  <input type="number" value={config.minimumAge} onChange={e => setConfig(prev => ({ ...prev, minimumAge: parseInt(e.target.value) }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Age Verification Method</label>
                  <select className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                    <option>OTP + ID Document</option>
                    <option>OTP Only</option>
                    <option>ID Document Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'delivery' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Delivery Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm">Default Delivery Start Hour</label>
                  <input type="time" value={config.deliveryStartHour} onChange={e => setConfig(prev => ({ ...prev, deliveryStartHour: e.target.value }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Default Delivery End Hour</label>
                  <input type="time" value={config.deliveryEndHour} onChange={e => setConfig(prev => ({ ...prev, deliveryEndHour: e.target.value }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Maximum Order Value (₹)</label>
                  <input type="number" value={config.maxOrderValue} onChange={e => setConfig(prev => ({ ...prev, maxOrderValue: parseInt(e.target.value) }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'fees' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Platform Fees Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm">Platform Fee (%)</label>
                  <input type="number" value={config.platformFeePercent} onChange={e => setConfig(prev => ({ ...prev, platformFeePercent: parseFloat(e.target.value) }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Base Delivery Fee (₹)</label>
                  <input type="number" value={config.deliveryFee} onChange={e => setConfig(prev => ({ ...prev, deliveryFee: parseInt(e.target.value) }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tax' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Tax Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-gray-400 text-sm">GST Rate (%)</label>
                  <input type="number" value={config.gstPercent} onChange={e => setConfig(prev => ({ ...prev, gstPercent: parseFloat(e.target.value) }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'payments' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Payment Provider Settings</h3>
              <div className="space-y-4">
                {Object.entries(config.paymentProviders).map(([provider, enabled]) => (
                  <div key={provider} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{provider === 'razorpay' ? '💳' : provider === 'stripe' ? '💳' : '💵'}</span>
                      <span className="text-white font-medium capitalize">{provider}</span>
                    </div>
                    <button onClick={() => setConfig(prev => ({ ...prev, paymentProviders: { ...prev.paymentProviders, [provider]: !enabled } }))} className={`w-12 h-6 rounded-full transition-colors relative ${enabled ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${enabled ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'maps' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Map Provider Settings</h3>
              <div>
                <label className="text-gray-400 text-sm">Map Provider</label>
                <select value={config.mapProvider} onChange={e => setConfig(prev => ({ ...prev, mapProvider: e.target.value }))} className="w-full mt-2 px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-emerald-500">
                  <option value="google">Google Maps</option>
                  <option value="mapbox">Mapbox</option>
                  <option value="openstreetmap">OpenStreetMap</option>
                </select>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Notification Settings</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Email Notifications', desc: 'Send order updates via email' },
                  { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Send order updates via SMS' },
                  { key: 'pushNotifications', label: 'Push Notifications', desc: 'Send push notifications to mobile apps' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-gray-400 text-xs">{item.desc}</p>
                    </div>
                    <button onClick={() => setConfig(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))} className={`w-12 h-6 rounded-full transition-colors relative ${config[item.key as keyof typeof config] ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${config[item.key as keyof typeof config] ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'maintenance' && (
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-6">
              <h3 className="text-white font-semibold text-lg">Maintenance Mode</h3>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-amber-400 text-sm font-medium">⚠️ This setting requires SUPER_ADMIN privileges</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="text-white font-medium">Enable Maintenance Mode</p>
                  <p className="text-gray-400 text-xs">When enabled, customers cannot place new orders</p>
                </div>
                <button onClick={() => setMaintenanceMode(!maintenanceMode)} className={`w-12 h-6 rounded-full transition-colors relative ${maintenanceMode ? 'bg-red-500' : 'bg-gray-600'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${maintenanceMode ? 'left-6' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
