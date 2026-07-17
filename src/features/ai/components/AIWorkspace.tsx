import React, { useState } from 'react';
import { useAIStore } from '../store/useAIStore';
import { ConversationSidebar } from './ConversationSidebar';
import { AIChatWindow } from './AIChatWindow';
import { X, Sparkles } from 'lucide-react';

export const AIWorkspace: React.FC = () => {
  const { isSidebarOpen, setSidebarOpen } = useAIStore();
  const [isConversationsOpen, setIsConversationsOpen] = useState(false);

  if (!isSidebarOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[450px] md:w-[500px] lg:w-[600px] bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col transition-all duration-300 transform translate-x-0">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm">AI Workspace</h2>
            <p className="text-[10px] text-slate-500 font-medium">Enterprise Generation Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => useAIStore.getState().setAdminDashboardOpen(true)}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition-colors hidden sm:block"
          >
            Platform Admin
          </button>
          <button 
            onClick={() => setIsConversationsOpen(!isConversationsOpen)}
            className="text-xs text-slate-500 hover:text-indigo-600 font-medium px-2 py-1 rounded hover:bg-slate-200 transition-colors hidden sm:block"
          >
            {isConversationsOpen ? 'Hide History' : 'Show History'}
          </button>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Side: Conversation History (Toggleable) */}
        {isConversationsOpen && (
          <div className="w-1/3 border-r border-slate-200 h-full overflow-hidden hidden sm:block bg-slate-50/50">
             <ConversationSidebar />
          </div>
        )}

        {/* Right Side: Chat Window */}
        <div className="flex-1 h-full overflow-hidden flex flex-col bg-white">
          <AIChatWindow />
        </div>
      </div>
    </div>
  );
};
