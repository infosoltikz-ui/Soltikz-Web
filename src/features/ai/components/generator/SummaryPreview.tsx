import React from 'react';
import { useAIStore } from '../../store/useAIStore';
import { useResume } from '../../../resume/hooks/resume.queries';
import { useUpdateSummary } from '../../../resume/hooks/resume.queries';
import { Check, X, Copy, RefreshCw } from 'lucide-react';
import { RichTextEditor } from '../../../resume/components/RichTextEditor';

export const SummaryPreview: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { generatedSummary, setGeneratedSummary, summaryLoading, setSummaryGeneratorOpen } = useAIStore();
  const { data: resume } = useResume(resumeId);
  const { mutate: updateSummary, isPending: isUpdating } = useUpdateSummary();

  const handleAccept = () => {
    if (!generatedSummary) return;
    
    updateSummary(
      { id: resumeId, data: { content: generatedSummary } },
      {
        onSuccess: () => {
          setGeneratedSummary('');
          setSummaryGeneratorOpen(false);
        }
      }
    );
  };

  const handleReject = () => {
    setGeneratedSummary('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSummary.replace(/<[^>]*>?/gm, ''));
  };

  if (summaryLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Generating your professional summary...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Generated Summary</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Copy text">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Current vs New Diff */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1 overflow-hidden">
        
        {/* Current Summary */}
        <div className="flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
            Current Summary
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {resume?.summary?.content ? (
               <div className="prose prose-sm prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: resume.summary.content }} />
            ) : (
               <p className="text-sm text-slate-400 italic">No summary currently saved.</p>
            )}
          </div>
        </div>

        {/* Generated Summary */}
        <div className="flex flex-col bg-indigo-50/30 rounded-xl border border-indigo-100 overflow-hidden relative shadow-sm">
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
            <span>AI Suggested</span>
            <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-[10px]">New</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <RichTextEditor 
              value={generatedSummary} 
              onChange={setGeneratedSummary} 
              placeholder="Generated summary will appear here..." 
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button 
          onClick={handleReject}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Reject
        </button>
        <button 
          onClick={handleAccept}
          disabled={isUpdating}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Check className="w-4 h-4" /> 
          {isUpdating ? 'Saving...' : 'Accept & Update Resume'}
        </button>
      </div>

    </div>
  );
};
