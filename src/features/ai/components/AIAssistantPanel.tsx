import React, { useState } from 'react';
import { useAIStore } from '../store/useAIStore';
import { useAIHistory, useAISettings } from '../hooks/ai.queries';
import { AISettingsPanel } from './AISettings';
import { Bot, X, MessageSquare, History, Settings2, Sparkles } from 'lucide-react';

export const AIAssistantPanel: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useAIStore();
  const { data: history, isLoading: isHistoryLoading } = useAIHistory();
  const { data: settings } = useAISettings();
  const [activeTab, setActiveTab] = useState<'assistant' | 'history' | 'settings'>('assistant');

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm">Enterprise AI</h2>
            <p className="text-xs text-slate-500 font-medium">{settings?.provider || 'OpenAI'} Backend</p>
          </div>
        </div>
        <button 
          onClick={() => setSidebarOpen(false)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex border-b border-slate-100 p-2 gap-1 bg-slate-50/50">
        <button 
          onClick={() => setActiveTab('assistant')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'assistant' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Generate
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'history' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          <History className="w-3.5 h-3.5" /> History
        </button>
        <button 
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5 ${activeTab === 'settings' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}
        >
          <Settings2 className="w-3.5 h-3.5" /> Config
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'settings' && <AISettingsPanel />}
        
        {activeTab === 'assistant' && (
          <div className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-800">AI Foundation Ready</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[250px]">
                The enterprise AI infrastructure is active. Content generation UI will be implemented in Sprint 4.2.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4">
            {isHistoryLoading ? (
              <p className="text-xs text-slate-400 text-center py-4">Loading history...</p>
            ) : history?.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No AI conversations yet.</p>
            ) : (
              <div className="space-y-3">
                {history?.map((conv: any) => (
                  <div key={conv.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-indigo-100 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-semibold text-slate-700">{conv.title || 'Conversation'}</h4>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 uppercase">{conv.provider}</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {new Date(conv.createdAt).toLocaleDateString()} • {conv.messages?.length || 0} messages
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
