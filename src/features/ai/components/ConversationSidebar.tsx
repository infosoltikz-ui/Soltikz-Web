import React from 'react';
import { useAIHistory } from '../hooks/ai.queries';
import { useAIStore } from '../store/useAIStore';
import { Plus, Search, MessageSquare, Loader2 } from 'lucide-react';

export const ConversationSidebar: React.FC = () => {
  const { data: history, isLoading } = useAIHistory();
  const { currentConversationId, setCurrentConversationId } = useAIStore();

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-slate-200">
        <button 
          onClick={() => setCurrentConversationId(null)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white border border-slate-200 rounded-md text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Chat
        </button>
      </div>
      
      <div className="p-3 border-b border-slate-200">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search history..." 
            className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
          </div>
        ) : history?.length === 0 ? (
          <p className="text-xs text-center text-slate-500 py-4">No conversations found.</p>
        ) : (
          history?.map((conv: any) => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversationId(conv.id)}
              className={`w-full text-left p-2 rounded-md transition-colors flex items-start gap-2 ${currentConversationId === conv.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 opacity-70" />
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">{conv.title || 'Resume Analysis'}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] text-slate-500">{new Date(conv.createdAt).toLocaleDateString()}</span>
                  <span className="text-[9px] uppercase font-semibold px-1 py-0.5 bg-white border border-slate-200 rounded text-slate-500">{conv.provider}</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};
