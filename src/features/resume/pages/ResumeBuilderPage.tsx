import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResume } from '../hooks/resume.queries';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { ResumeToolbar } from '../components/ResumeToolbar';
import { ResumeSidebar } from '../components/ResumeSidebar';
import { ResumeEditor } from '../components/ResumeEditor';
import { ResumePreview } from '../components/ResumePreview';

export const ResumeBuilderPage: React.FC = () => {
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resume, isLoading } = useResume(resumeId!);
  const { setShowMobilePreview } = useResumeBuilderStore();

  useEffect(() => {
    // Reset mobile preview when loading a new resume
    setShowMobilePreview(false);
  }, [resumeId, setShowMobilePreview]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-200 rounded-full mb-4"></div>
          <div className="w-32 h-4 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Resume Not Found</h2>
          <p className="text-slate-500 mb-6">The resume you are looking for does not exist.</p>
          <Link to="/dashboard" className="text-primary-600 hover:underline">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex flex-col overflow-hidden">
      <ResumeToolbar resume={resume} />

      <div className="flex-1 flex overflow-hidden">
        <ResumeSidebar resume={resume} />
        <ResumeEditor resume={resume} />
        <ResumePreview resume={resume} />
      </div>
    </div>
  );
};
