import React from 'react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { JobDescriptionPanel } from './JobDescriptionPanel';
import { AnalysisSidebar } from './AnalysisSidebar';
import { ResumeOptimizationPanel } from './optimization/ResumeOptimizationPanel';
import { X, Target, Wand2 } from 'lucide-react';

interface JDWorkspaceProps {
  resumeId: string;
}

export const JDWorkspace: React.FC<JDWorkspaceProps> = ({ resumeId }) => {
  const { isJdPanelOpen, setIsJdPanelOpen } = useResumeBuilderStore();
  const [activeTab, setActiveTab] = React.useState<'analysis' | 'optimization'>('analysis');

  if (!isJdPanelOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] md:w-[800px] lg:w-[900px] bg-white shadow-2xl border-l border-slate-200 z-40 flex flex-col transition-all duration-300 transform translate-x-0 mt-16">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex bg-slate-200/50 p-0.5 rounded-md">
              <button 
                onClick={() => setActiveTab('analysis')}
                className={`text-xs px-3 py-1 font-medium rounded-sm transition-colors ${activeTab === 'analysis' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Analysis
              </button>
              <button 
                onClick={() => setActiveTab('optimization')}
                className={`text-xs px-3 py-1 font-medium rounded-sm transition-colors flex items-center gap-1 ${activeTab === 'optimization' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <Wand2 className="w-3 h-3" />
                Optimization
              </button>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsJdPanelOpen(false)}
          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: JD Input */}
        <div className="flex-1 bg-white p-4 overflow-y-auto">
          <JobDescriptionPanel resumeId={resumeId} />
        </div>

        {/* Right Side: Analysis Sidebar or Optimization Panel */}
        <div className="hidden md:block">
          {activeTab === 'analysis' ? (
            <AnalysisSidebar resumeId={resumeId} />
          ) : (
            <ResumeOptimizationPanel resumeId={resumeId} />
          )}
        </div>
      </div>
    </div>
  );
};
