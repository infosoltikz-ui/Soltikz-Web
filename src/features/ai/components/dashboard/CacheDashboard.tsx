import React from 'react';
import { useClearCache } from '../../hooks/useAIPlatform';
import { HardDrive, Trash2, CheckCircle2 } from 'lucide-react';

export const CacheDashboard: React.FC = () => {
  const { mutate: clearCache, isPending, isSuccess } = useClearCache();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <HardDrive className="w-5 h-5 text-indigo-500" />
          Cache Management
        </h3>
        <button
          onClick={() => clearCache()}
          disabled={isPending}
          className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <span className="animate-pulse">Clearing...</span>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              Clear Expired Cache
            </>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mb-4">
        AI responses are cached based on exact prompt hashes to reduce API costs and improve latency. 
        Expired caches are cleaned up automatically during cache misses, but you can manually trigger a cleanup here.
      </p>

      {isSuccess && (
        <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Expired cache cleared successfully.
        </div>
      )}
    </div>
  );
};
