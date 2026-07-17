import React from 'react';
import { useAIStore } from '../../store/useAIStore';
import { X, Sparkles } from 'lucide-react';
import { SummaryGeneratorForm } from './SummaryGeneratorForm';
import { SummaryPreview } from './SummaryPreview';
import { SummaryHistory } from './SummaryHistory';

export const AIGenerationModal: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { isSummaryGeneratorOpen, setSummaryGeneratorOpen, generatedSummary } = useAIStore();

  if (!isSummaryGeneratorOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-center pt-10 sm:pt-20 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-fit mb-20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">AI Summary Generator</h2>
              <p className="text-sm text-slate-500 font-medium">Create ATS-friendly, professional summaries</p>
            </div>
          </div>
          <button 
            onClick={() => setSummaryGeneratorOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row h-full max-h-[80vh]">
          {/* Left Side: Form */}
          <div className="w-full md:w-1/3 border-r border-slate-100 bg-slate-50 overflow-y-auto p-5">
            <SummaryGeneratorForm resumeId={resumeId} />
          </div>

          {/* Right Side: Preview & History */}
          <div className="w-full md:w-2/3 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto bg-white p-6">
              {generatedSummary ? (
                <SummaryPreview resumeId={resumeId} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                    <Sparkles className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">Ready to generate</h3>
                  <p className="text-slate-500 max-w-sm">
                    Adjust the settings on the left and click Generate to create a tailored professional summary.
                  </p>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 bg-slate-50 h-48 overflow-y-auto">
              <SummaryHistory resumeId={resumeId} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
