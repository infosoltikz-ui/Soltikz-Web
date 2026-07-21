import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Users, FileText, CreditCard, Activity, Settings, Shield, Bell, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';

const sidebarNavigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Resumes', href: '/admin/resumes', icon: FileText },
  { name: 'Billing', href: '/admin/billing', icon: CreditCard },
  { name: 'AI Usage', href: '/admin/ai-usage', icon: Activity },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const location = useLocation();
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Shield className="h-8 w-8 text-blue-500 mr-2" />
          <span className="text-xl font-bold">Admin Panel</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {sidebarNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-300'
                  } mr-3 flex-shrink-0 h-5 w-5`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {sidebarNavigation.find(n => n.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" aria-hidden="true" />
            </button>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 mr-2">{user?.name}</span>
              {user?.avatar ? (
                <img className="h-8 w-8 rounded-full" src={user.avatar} alt="" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
