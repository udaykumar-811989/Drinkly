'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  avatar?: string;
}

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Customers', href: '/admin/customers', icon: '👥' },
  { label: 'Retailers', href: '/admin/retailers', icon: '🏪' },
  { label: 'Delivery Agents', href: '/admin/delivery-agents', icon: '🚚' },
  { label: 'Orders', href: '/admin/orders', icon: '📦' },
  { label: 'Products', href: '/admin/products', icon: '🍶' },
  { label: 'Licences', href: '/admin/licences', icon: '📋' },
  { label: 'Compliance', href: '/admin/compliance', icon: '⚖️' },
  { label: 'Payments', href: '/admin/payments', icon: '💳' },
  { label: 'Refunds', href: '/admin/refunds', icon: '↩️' },
  { label: 'Reports', href: '/admin/reports', icon: '📈' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️', requiresSuperAdmin: true },
  { label: 'Audit Logs', href: '/admin/audit-logs', icon: '📝' },
];

const notifications = [
  { id: '1', message: 'New retailer pending approval', time: '2m ago', read: false },
  { id: '2', message: 'Licence expiring in 7 days', time: '15m ago', read: false },
  { id: '3', message: 'Refund request pending', time: '1h ago', read: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) {
      const parsed = JSON.parse(stored) as AdminUser;
      if (parsed.role !== 'ADMIN' && parsed.role !== 'SUPER_ADMIN') {
        router.push('/login');
        return;
      }
      setUser(parsed);
    } else {
      setUser({ id: '1', name: 'Admin User', email: 'admin@drinkly.com', role: 'SUPER_ADMIN' });
    }
  }, [router]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNav = navItems.filter(item => {
    if (item.requiresSuperAdmin && user?.role !== 'SUPER_ADMIN') return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 z-50 transition-all duration-300 flex flex-col
          ${sidebarOpen ? 'w-64' : 'w-20'}
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
              <span className="text-white font-bold text-lg">Drinkly</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden lg:block p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filteredNav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm
                ${pathname === item.href
                  ? 'bg-emerald-500/20 text-emerald-400 font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className={`flex items-center gap-3 px-3 py-2.5 ${sidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                <p className="text-gray-500 text-xs truncate">{user?.role}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-6 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"
              >
                ☰
              </button>
              <h1 className="text-white text-lg font-semibold capitalize">
                {pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-3 border-b border-gray-700 flex items-center justify-between">
                      <span className="text-white font-medium text-sm">Notifications</span>
                      <button className="text-emerald-400 text-xs hover:text-emerald-300">Mark all read</button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`p-3 border-b border-gray-700/50 hover:bg-gray-700/50 cursor-pointer ${!n.read ? 'bg-gray-700/30' : ''}`}>
                          <p className="text-white text-sm">{n.message}</p>
                          <p className="text-gray-500 text-xs mt-1">{n.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
