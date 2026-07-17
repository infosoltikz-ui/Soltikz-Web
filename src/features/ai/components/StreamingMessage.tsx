import React from 'react';
import { Bot } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

export const StreamingMessage: React.FC<{ content: string }> = ({ content }) => {
  return (
    <div className="flex gap-3 mb-6 w-full">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1 relative overflow-hidden">
        <Bot className="w-5 h-5 text-indigo-600 relative z-10" />
        <div className="absolute inset-0 bg-indigo-200/50 animate-pulse"></div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm border-l-2 border-l-indigo-400">
          <MarkdownRenderer content={content} />
          <span className="inline-block w-2 h-4 bg-indigo-400 ml-1 animate-pulse align-middle rounded-sm"></span>
        </div>
      </div>
    </div>
  );
};
