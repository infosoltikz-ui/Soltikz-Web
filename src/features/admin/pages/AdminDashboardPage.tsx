import React, { useEffect, useState } from 'react';
import { Users, FileText, CreditCard, Activity, ArrowUpRight, ShieldCheck } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center">
    <div className="p-4 rounded-lg bg-blue-50 text-blue-600 mr-4">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        {trend && (
          <span className="text-sm font-medium text-green-600 flex items-center">
            {trend} <ArrowUpRight className="h-4 w-4 ml-1" />
          </span>
        )}
      </div>
    </div>
  </div>
);

export const AdminDashboardPage = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    // Mocking for now to avoid blocking UI rendering before backend is fully hooked up
    setTimeout(() => {
      setData({
        totalUsers: 1250,
        activeUsers: 842,
        newUsersToday: 24,
        totalRevenue: 45200,
        totalResumes: 3400,
        totalCoverLetters: 1800,
        totalAiGenerations: 12400,
        serverStatus: 'ONLINE',
      });
      setLoading(false);
    }, 500);

  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={data?.totalUsers} icon={Users} trend="+12%" />
        <StatCard title="Active Users" value={data?.activeUsers} icon={Activity} />
        <StatCard title="Total Revenue" value={`$${(data?.totalRevenue / 100).toLocaleString()}`} icon={CreditCard} trend="+8%" />
        <StatCard title="Total Resumes" value={data?.totalResumes} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
            System Health
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">API Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                {data?.serverStatus}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                ONLINE
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">AI Services</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                OPERATIONAL
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
            <span className="text-gray-400">Activity Chart Placeholder</span>
          </div>
        </div>
      </div>
    </div>
  );
};
