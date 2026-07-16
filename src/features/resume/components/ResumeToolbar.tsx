import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Loader2, Save, XCircle } from 'lucide-react';
import { Resume } from '../services/resume.api';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { Button } from '@/components/ui/Button';

interface ResumeToolbarProps {
  resume: Resume;
}

export const ResumeToolbar: React.FC<ResumeToolbarProps> = ({ resume }) => {
  const { saveStatus, lastSavedAt, showMobilePreview, setShowMobilePreview } = useResumeBuilderStore();

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </div>
        );
      case 'saved':
        return (
          <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Saved
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-rose-600 text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Save Failed
          </div>
        );
      case 'idle':
      default:
        return lastSavedAt ? (
          <div className="flex items-center gap-1.5 text-slate-400 text-sm font-medium">
            <Save className="w-4 h-4" />
            Last saved {lastSavedAt}
          </div>
        ) : null;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="hidden sm:block">
          <h1 className="font-semibold text-slate-900 leading-tight">{resume.title}</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{resume.template?.name || 'Blank Template'}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="flex items-center gap-1">
              ATS Score: <span className="text-slate-400 italic">Coming Soon</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {renderSaveStatus()}
        
        {/* Mobile Preview Toggle */}
        <Button 
          variant={showMobilePreview ? 'primary' : 'outline'}
          size="sm"
          className="md:hidden"
          onClick={() => setShowMobilePreview(!showMobilePreview)}
        >
          {showMobilePreview ? 'Edit' : 'Preview'}
        </Button>

        {/* AI Assistant - Coming Soon */}
        <Button variant="secondary" size="sm" className="hidden sm:inline-flex opacity-50 cursor-not-allowed">
          AI Assistant
        </Button>
      </div>
    </header>
  );
};
