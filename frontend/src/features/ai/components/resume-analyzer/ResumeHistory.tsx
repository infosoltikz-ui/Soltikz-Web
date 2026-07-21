import { useEffect, useState, FC } from 'react';
import { Clock, Loader2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ResumeHistoryItem {
  id: string;
  createdAt: string;
  variables: any;
  response: string;
}

interface ResumeHistoryProps {
  resumeId: string;
  onSelect: (result: any) => void;
}

export const ResumeHistory: FC<ResumeHistoryProps> = ({ resumeId, onSelect }) => {
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/ai/resume/history?resumeId=${resumeId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setHistory(data.history);
      }
    } catch (error) {
      console.error('Failed to fetch resume analyzer history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // In a real app we might want to poll or use a socket to update history
  }, [resumeId]);

  const handleSelect = (item: ResumeHistoryItem) => {
    try {
      const jsonMatch = item.response.match(/```json\n([\s\S]*?)\n```/);
      const jsonString = jsonMatch ? jsonMatch[1] : item.response;
      const parsed = JSON.parse(jsonString);
      onSelect(parsed);
    } catch (e) {
      console.error('Failed to parse history item:', e);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-slate-500" />
        <h3 className="text-lg font-semibold text-slate-900">Analysis History</h3>
      </div>
      
      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        {history.length === 0 ? (
          <p className="text-sm text-slate-500 italic text-center py-8">
            No past analyses found. Run a scan to see history here.
          </p>
        ) : (
          history.map((item) => {
            const date = new Date(item.createdAt);
            
            // Extract score from raw response for preview
            let previewScore = 0;
            let previewGrade = 'N/A';
            try {
              const jsonMatch = item.response.match(/```json\n([\s\S]*?)\n```/);
              const jsonString = jsonMatch ? jsonMatch[1] : item.response;
              const parsed = JSON.parse(jsonString);
              previewScore = parsed.overallScore || 0;
              // Very naive grade mapping just for preview
              if (previewScore >= 90) previewGrade = 'A';
              else if (previewScore >= 80) previewGrade = 'B';
              else if (previewScore >= 70) previewGrade = 'C';
              else if (previewScore >= 60) previewGrade = 'D';
              else previewGrade = 'F';
            } catch(e) {}

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full text-left group p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-slate-900 group-hover:text-blue-700">
                    {date.toLocaleDateString()} at {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Score: {previewScore}/100 • Grade: {previewGrade}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
