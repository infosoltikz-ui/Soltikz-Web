import { FC, useEffect, useState } from 'react';
import { exportApi } from '../api/exportApi';
import { BarChart3 } from 'lucide-react';

export const ExportAnalytics: FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await exportApi.getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-4 text-center text-slate-500 animate-pulse">Loading analytics...</div>;
  }

  if (!analytics) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-semibold text-slate-900">Export Analytics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <div className="text-3xl font-bold text-slate-900">{analytics.totalExports}</div>
          <div className="text-sm font-medium text-slate-500">Total Exports</div>
        </div>
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <div className="text-3xl font-bold text-slate-900">{analytics.totalShares}</div>
          <div className="text-sm font-medium text-slate-500">Active Shares</div>
        </div>
      </div>

      {analytics.formatStats && analytics.formatStats.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-900">Format Popularity</h4>
          {analytics.formatStats.map((stat: any) => (
            <div key={stat.format} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-600">
                <span>{stat.format}</span>
                <span>{stat._count}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 rounded-full" 
                  style={{ width: `${Math.min(100, (stat._count / Math.max(analytics.totalExports, 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
