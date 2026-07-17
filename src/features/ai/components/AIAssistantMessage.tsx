import React from 'react';
import { Bot, Copy, RefreshCw, CheckCircle2 } from 'lucide-react';
import { AIMessageType } from '../store/useAIStore';
import { MarkdownRenderer } from './MarkdownRenderer';
import { DiffViewer } from './DiffViewer';

export const AIAssistantMessage: React.FC<{ message: AIMessageType }> = ({ message }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-3 mb-6 w-full group">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 mt-1">
        <Bot className="w-5 h-5 text-indigo-600" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
          <MarkdownRenderer content={message.content} />
          
          {/* Action Footer */}
          <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Regenerate
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
              {message.provider && (
                <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 uppercase">{message.provider}</span>
              )}
              {message.cost !== undefined && (
                <span className="text-emerald-600">${message.cost.toFixed(5)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
