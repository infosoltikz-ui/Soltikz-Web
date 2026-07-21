import React from 'react';
import { useProviderHealth } from '../../hooks/useAIPlatform';
import { Activity, CheckCircle, XCircle } from 'lucide-react';

export const ProviderHealthCard: React.FC = () => {
  const { data: healthData, isLoading, isError } = useProviderHealth();

  if (isLoading) return <div className="p-4 border rounded-lg bg-gray-50 text-sm animate-pulse">Checking Provider Health...</div>;
  if (isError) return <div className="p-4 border border-red-200 bg-red-50 text-red-600 rounded-lg text-sm">Failed to load provider health</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-indigo-500" />
        AI Provider Health
      </h3>
      <div className="space-y-3">
        {healthData?.map((provider: any) => (
          <div key={provider.provider} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="font-medium text-gray-700">{provider.provider}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500">{provider.latency}ms</span>
              {provider.status === 'ONLINE' ? (
                <span className="flex items-center gap-1 text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                  <CheckCircle className="w-4 h-4" /> Online
                </span>
              ) : (
                <span className="flex items-center gap-1 text-sm font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
                  <XCircle className="w-4 h-4" /> Offline
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
