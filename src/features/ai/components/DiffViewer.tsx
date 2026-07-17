import React from 'react';
import * as Diff from 'diff';
import { Check, X } from 'lucide-react';

interface DiffViewerProps {
  originalText: string;
  newText: string;
  onAccept?: () => void;
  onReject?: () => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ originalText, newText, onAccept, onReject }) => {
  const differences = Diff.diffWords(originalText, newText);

  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white my-4 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Suggested Changes</h4>
        <div className="flex items-center gap-2">
          {onReject && (
            <button 
              onClick={onReject}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded transition-colors"
            >
              <X className="w-3 h-3" /> Reject
            </button>
          )}
          {onAccept && (
            <button 
              onClick={onAccept}
              className="flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors"
            >
              <Check className="w-3 h-3" /> Accept
            </button>
          )}
        </div>
      </div>
      
      <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap font-mono">
        {differences.map((part, index) => {
          const colorClass = part.added 
            ? 'bg-emerald-100 text-emerald-800 rounded px-0.5' 
            : part.removed 
              ? 'bg-rose-100 text-rose-800 line-through rounded px-0.5 opacity-60' 
              : 'text-slate-700';
          
          return (
            <span key={index} className={colorClass}>
              {part.value}
            </span>
          );
        })}
      </div>
    </div>
  );
};
