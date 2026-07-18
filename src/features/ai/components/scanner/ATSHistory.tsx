import React, { useEffect, useState } from 'react';
import { Clock, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ATSHistoryItem {
  id: string;
  createdAt: string;
  variables: any;
  response: string;
}

interface ATSHistoryProps {
  resumeId: string;
  onSelect: (result: any) => void;
}

export const ATSHistory: React.FC<ATSHistoryProps> = ({ resumeId, onSelect }) => {
  const [history, setHistory] = useState<ATSHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(`/api/ai/ats/history?resumeId=${resumeId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setHistory(data.history);
        }
      } catch (error) {
        console.error('Failed to fetch ATS history:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading history...
      </div>
    );
  }

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-500" />
        Scan History
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {history.map((item) => {
          let score = 0;
          try {
            const jsonMatch = item.response.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : item.response;
            const parsed = JSON.parse(jsonString);
            score = parsed.overallScore || 0;
          } catch (e) {
            // Ignore
          }

          return (
            <div 
              key={item.id} 
              className="border border-slate-200 rounded-xl p-4 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col"
              onClick={() => {
                try {
                  const jsonMatch = item.response.match(/```json\n([\s\S]*?)\n```/);
                  const jsonString = jsonMatch ? jsonMatch[1] : item.response;
                  onSelect(JSON.parse(jsonString));
                } catch (e) {
                  console.error('Failed to parse history item');
                }
              }}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
                <span className={`text-lg font-bold ${score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                  {score}%
                </span>
              </div>
              <div className="mt-auto pt-4 flex items-center justify-between text-sm text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>View Results</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
