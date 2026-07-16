import React from 'react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { Resume } from '../services/resume.api';

interface ResumePreviewProps {
  resume: Resume;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ resume }) => {
  const { showMobilePreview } = useResumeBuilderStore();

  return (
    <div className={`flex-1 bg-slate-100/80 p-4 md:p-8 overflow-y-auto ${!showMobilePreview ? 'hidden md:flex' : 'flex'} justify-center items-start`}>
      {/* A4 Paper Wrapper */}
      <div className="w-full max-w-[794px] min-h-[1123px] bg-white shadow-md ring-1 ring-slate-900/5 sm:rounded-sm mx-auto p-8 md:p-12 transition-all">
        {/* Basic Plain Text Preview for Sprint 3.2 */}
        
        <header className="border-b-2 border-slate-900 pb-6 mb-6 text-center">
          <h1 className="text-3xl font-serif text-slate-900 font-bold uppercase tracking-wide">
            {resume.personal?.firstName} {resume.personal?.lastName}
            {!resume.personal?.firstName && !resume.personal?.lastName && (
              <span className="text-slate-300 italic normal-case tracking-normal font-normal">Your Name</span>
            )}
          </h1>
          {resume.personal?.title && (
            <p className="text-lg text-slate-700 mt-1 font-medium">{resume.personal.title}</p>
          )}
          
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-4 text-sm text-slate-600">
            {resume.personal?.email && <span>{resume.personal.email}</span>}
            {resume.personal?.phone && (
              <>
                <span className="text-slate-400">•</span>
                <span>{resume.personal.phone}</span>
              </>
            )}
            {(resume.personal?.city || resume.personal?.country) && (
              <>
                <span className="text-slate-400">•</span>
                <span>{[resume.personal.city, resume.personal.country].filter(Boolean).join(', ')}</span>
              </>
            )}
          </div>
        </header>

        {resume.summary?.content && (
          <section className="mb-6">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1 mb-3">
              Professional Summary
            </h2>
            <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">
              {resume.summary.content}
            </p>
          </section>
        )}
      </div>
    </div>
  );
};
