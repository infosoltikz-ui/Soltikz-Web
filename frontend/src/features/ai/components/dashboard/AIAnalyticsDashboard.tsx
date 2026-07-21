import React from 'react';
import { useAIAnalytics } from '../../hooks/useAIPlatform';
import { BarChart, TrendingUp, Target, DollarSign, Clock } from 'lucide-react';

export const AIAnalyticsDashboard: React.FC = () => {
  const { data: stats, isLoading } = useAIAnalytics();

  if (isLoading) return <div className="p-4 border rounded-lg bg-gray-50 text-sm animate-pulse">Loading Analytics...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        <BarChart className="w-5 h-5 text-indigo-500" />
        Platform Analytics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Daily Requests */}
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl">
          <div className="text-blue-500 mb-2">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats?.dailyRequests || 0}</div>
          <div className="text-xs text-gray-500 font-medium">Daily Requests</div>
        </div>

        {/* Success Rate */}
        <div className="bg-green-50/50 border border-green-100 p-4 rounded-xl">
          <div className="text-green-500 mb-2">
            <Target className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats?.successRate.toFixed(1) || 0}%</div>
          <div className="text-xs text-gray-500 font-medium">Success Rate</div>
        </div>

        {/* Avg Latency */}
        <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-xl">
          <div className="text-purple-500 mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-gray-800">{stats?.avgLatency.toFixed(0) || 0}ms</div>
          <div className="text-xs text-gray-500 font-medium">Avg Latency</div>
        </div>

        {/* Total Cost */}
        <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl">
          <div className="text-rose-500 mb-2">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-gray-800">${stats?.totalCost.toFixed(4) || '0.00'}</div>
          <div className="text-xs text-gray-500 font-medium">Monthly Cost</div>
        </div>
      </div>
    </div>
  );
};
