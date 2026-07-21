import React from 'react';
import { DiffViewer } from './DiffViewer';

interface AIPreviewPanelProps {
  sectionName: string;
  originalText: string;
  suggestedText: string;
  onAccept: () => void;
  onReject: () => void;
  onRegenerate: () => void;
}

export const AIPreviewPanel: React.FC<AIPreviewPanelProps> = ({ 
  sectionName, 
  originalText, 
  suggestedText, 
  onAccept, 
  onReject,
  onRegenerate 
}) => {
  return (
    <div className="bg-white border border-indigo-100 shadow-md rounded-xl p-5 my-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <span className="text-indigo-600">AI Suggestion</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 text-sm">{sectionName}</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">Review the changes before applying them to your resume.</p>
        </div>
      </div>

      <div className="mt-2">
        <DiffViewer 
          originalText={originalText} 
          newText={suggestedText} 
          onAccept={onAccept}
          onReject={onReject}
        />
      </div>

      <div className="mt-4 flex justify-between items-center pt-3 border-t border-slate-100">
        <button 
          onClick={onRegenerate}
          className="text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
        >
          Try another version
        </button>
      </div>
    </div>
  );
};
