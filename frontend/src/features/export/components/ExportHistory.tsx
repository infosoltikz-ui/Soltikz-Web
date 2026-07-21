import { FC, useEffect, useState } from 'react';
import { exportApi } from '../api/exportApi';
import { Clock, CheckCircle2, XCircle } from 'lucide-react';

interface ExportHistoryProps {
  resumeId: string;
}

export const ExportHistory: FC<ExportHistoryProps> = ({ resumeId }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await exportApi.getExportHistory(resumeId);
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [resumeId]);

  if (loading) {
    return <div className="p-4 text-center text-slate-500 animate-pulse">Loading history...</div>;
  }

  if (history.length === 0) {
    return <div className="p-4 text-center text-slate-500">No export history found.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Export History</h3>
      </div>
      
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {history.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50">
            <div className="flex items-center gap-3">
              {item.status === 'SUCCESS' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-500" />
              )}
              <div>
                <div className="font-medium text-slate-900 text-sm">
                  {item.format} Export
                </div>
                <div className="text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString()} • {item.template}
                </div>
              </div>
            </div>
            {item.fileSize && (
              <div className="text-xs text-slate-500 font-mono">
                {(item.fileSize / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
