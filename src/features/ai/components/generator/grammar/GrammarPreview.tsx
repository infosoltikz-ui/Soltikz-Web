import React, { useState } from 'react';
import { useAIStore } from '../../../store/useAIStore';
import { Check, X, Copy, ArrowRightLeft } from 'lucide-react';
import { 
  useUpdateSummary, 
  useUpdateExperience, 
  useUpdateProject, 
  useUpdateAchievement 
} from '../../../../resume/hooks/resume.queries';

export const GrammarPreview: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { 
    generatedGrammar, 
    setGeneratedGrammar, 
    grammarLoading, 
    setGeneratorOpen, 
    grammarTargetContent,
    grammarTargetType,
    generatorSelectedId 
  } = useAIStore();

  const [isUpdating, setIsUpdating] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'optimized'>('split');

  const { mutate: updateSummary } = useUpdateSummary();
  const { mutate: updateExperience } = useUpdateExperience();
  const { mutate: updateProject } = useUpdateProject();
  const { mutate: updateAchievement } = useUpdateAchievement();

  const handleAccept = () => {
    if (!generatedGrammar || !grammarTargetType) return;
    setIsUpdating(true);

    const data = { description: generatedGrammar };
    const summaryData = { summary: generatedGrammar };

    const onSuccess = () => {
      setIsUpdating(false);
      setGeneratedGrammar('');
      setGeneratorOpen(false);
    };
    
    const onError = () => setIsUpdating(false);

    switch (grammarTargetType) {
      case 'summary':
        updateSummary({ id: resumeId, data: summaryData }, { onSuccess, onError });
        break;
      case 'experience':
        if (!generatorSelectedId) { setIsUpdating(false); return; }
        updateExperience({ id: resumeId, expId: generatorSelectedId, data }, { onSuccess, onError });
        break;
      case 'project':
        if (!generatorSelectedId) { setIsUpdating(false); return; }
        updateProject({ id: resumeId, projectId: generatorSelectedId, data }, { onSuccess, onError });
        break;
      case 'achievement':
        if (!generatorSelectedId) { setIsUpdating(false); return; }
        updateAchievement({ id: resumeId, achievementId: generatorSelectedId, data }, { onSuccess, onError });
        break;
      default:
        setIsUpdating(false);
    }
  };

  const handleReject = () => {
    setGeneratedGrammar('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedGrammar.replace(/<[^>]*>?/gm, ''));
  };

  if (grammarLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Analyzing and optimizing text...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Optimized Text</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(v => v === 'split' ? 'optimized' : 'split')}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ArrowRightLeft className="w-4 h-4" />
            {viewMode === 'split' ? 'Hide Original' : 'Show Original'}
          </button>
          <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Copy text">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row gap-4 h-full min-h-[300px]`}>
        {/* Original Content */}
        {viewMode === 'split' && (
          <div className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider line-through decoration-red-300">
              Original Text
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <div dangerouslySetInnerHTML={{ __html: grammarTargetContent }} className="prose prose-sm max-w-none text-slate-400" />
            </div>
          </div>
        )}

        {/* Optimized Content */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm relative">
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Optimized Text
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            {generatedGrammar ? (
              <div dangerouslySetInnerHTML={{ __html: generatedGrammar }} className="prose prose-sm max-w-none text-slate-700" />
            ) : (
              <p className="text-sm text-slate-400 italic">No optimizations generated yet.</p>
            )}
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
          disabled={isUpdating || !generatedGrammar}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> 
          {isUpdating ? 'Saving...' : 'Accept Changes'}
        </button>
      </div>
    </div>
  );
};
