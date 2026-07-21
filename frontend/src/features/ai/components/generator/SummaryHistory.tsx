import React from 'react';
import { useSummaryHistory } from '../../hooks/useSummaryGenerator';
import { Clock, MessageSquareText } from 'lucide-react';
import { useAIStore } from '../../store/useAIStore';

export const SummaryHistory: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { data: history, isLoading } = useSummaryHistory(resumeId);
  const { setGeneratedSummary } = useAIStore();

  if (isLoading) {
    return <div className="p-4 text-xs text-slate-500 text-center">Loading history...</div>;
  }

  if (!history || history.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500">
        <Clock className="w-6 h-6 mx-auto mb-2 text-slate-300" />
        <p className="text-xs">No generation history found for this session.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">Recent Generations</h4>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
        {history.map((conv: any) => {
          // Find the last assistant message
          const lastMsg = conv.messages?.slice().reverse().find((m: any) => m.role === 'ASSISTANT');
          if (!lastMsg) return null;

          return (
            <div 
              key={conv.id}
              onClick={() => setGeneratedSummary(lastMsg.content)}
              className="min-w-[250px] max-w-[250px] bg-white border border-slate-200 rounded-xl p-3 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all group snap-start"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-indigo-600">
                  <MessageSquareText className="w-4 h-4" />
                  <span className="text-xs font-semibold">AI Generated</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(conv.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {lastMsg.content.replace(/<[^>]*>?/gm, '')}
              </p>
              <div className="mt-2 text-[10px] text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Click to preview &rarr;
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
