import React from 'react';
import { AIAnalyticsDashboard } from './AIAnalyticsDashboard';
import { ProviderHealthCard } from './ProviderHealthCard';
import { PromptRegistryTable } from './PromptRegistryTable';
import { CacheDashboard } from './CacheDashboard';
import { useAIStore } from '../../store/useAIStore';
import { X, ShieldCheck } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { isAdminDashboardOpen, setAdminDashboardOpen } = useAIStore();

  if (!isAdminDashboardOpen) return null;

  return (
    <div className="absolute inset-0 bg-gray-50/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enterprise AI Platform</h1>
              <p className="text-sm text-gray-500">Analytics, Health, and Configuration</p>
            </div>
          </div>
          <button 
            onClick={() => setAdminDashboardOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AIAnalyticsDashboard />
            <PromptRegistryTable />
          </div>
          <div className="space-y-6">
            <ProviderHealthCard />
            <CacheDashboard />
          </div>
        </div>

      </div>
    </div>
  );
};
