import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Save, XCircle, Menu } from 'lucide-react';
import { Resume } from '../services/resume.api';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { useAIStore } from '../../ai/store/useAIStore';
import { Button } from '@/components/ui/Button';

interface ResumeToolbarProps {
  resume: Resume;
}

export const ResumeToolbar: React.FC<ResumeToolbarProps> = ({ resume }) => {
  const { saveStatus, lastSavedAt, showMobilePreview, setShowMobilePreview, isSidebarOpen, setIsSidebarOpen } = useResumeBuilderStore();

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Saving...</span>
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-rose-600 text-sm font-medium">
            <XCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Failed</span>
          </div>
        );
      case 'idle':
      default:
        return lastSavedAt ? (
          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Saved {lastSavedAt}</span>
          </div>
        ) : null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-2 md:gap-3">
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="md:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/dashboard" className="p-2 hidden md:block -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="hidden sm:block">
          <h1 className="font-semibold text-slate-900 leading-tight truncate max-w-[200px] md:max-w-xs">{resume.title}</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{resume.template?.name || 'Blank Template'}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1">
              ATS Score: <span className="text-slate-400 italic">Coming Soon</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {renderSaveStatus()}
        
        {/* Mobile Preview Toggle */}
        <Button 
          variant={showMobilePreview ? 'primary' : 'outline'}
          size="sm"
          className="md:hidden"
          onClick={() => {
            setShowMobilePreview(!showMobilePreview);
            setIsSidebarOpen(false); // Close sidebar when toggling preview
          }}
        >
          {showMobilePreview ? 'Edit' : 'Preview'}
        </Button>

        {/* ATS Scanner Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:inline-flex"
          as={Link}
          to={`/dashboard/resumes/${resume.id}/ats-scanner`}
        >
          ATS Scanner
        </Button>

        {/* Job Analyzer Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex"
          as={Link}
          to={`/dashboard/resumes/${resume.id}/job-analyzer`}
        >
          Job Analyzer
        </Button>

        {/* Export Resume Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
          as={Link}
          to={`/dashboard/resumes/${resume.id}/export`}
        >
          Export Resume
        </Button>

        {/* Resume Analyzer Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
          as={Link}
          to={`/dashboard/resumes/${resume.id}/analyzer`}
        >
          Resume Analyzer
        </Button>

        {/* AI Cover Letter Button */}
        <Button
          variant="outline"
          size="sm"
          className="hidden md:inline-flex bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100"
          as={Link}
          to={`/dashboard/resumes/${resume.id}/cover-letter`}
        >
          Cover Letter
        </Button>

        {/* AI Assistant Toggle */}
        <Button 
          variant="secondary" 
          size="sm" 
          className="hidden sm:inline-flex"
          onClick={() => useAIStore.getState().setSidebarOpen(!useAIStore.getState().isSidebarOpen)}
        >
          AI Assistant
        </Button>
      </div>
    </header>
  );
};
