import React from 'react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { Resume } from '../services/resume.api';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';

interface ResumeEditorProps {
  resume: Resume;
}

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume }) => {
  const { activeSection, showMobilePreview } = useResumeBuilderStore();

  const renderSection = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Personal Details</h2>
              <p className="text-slate-500 mt-1">Get started with the basic details about you.</p>
            </div>
            <PersonalInfoForm resume={resume} />
          </div>
        );
      case 'summary':
        return (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Professional Summary</h2>
              <p className="text-slate-500 mt-1">A short summary of your experience and achievements.</p>
            </div>
            <SummaryForm resume={resume} />
          </div>
        );
      default:
        return (
          <div className="max-w-3xl mx-auto text-center py-20 animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚧</span>
            </div>
            <h2 className="text-xl font-semibold text-slate-700">Coming in Sprint 3.3</h2>
            <p className="text-slate-500 mt-2">
              The <span className="font-medium capitalize">{activeSection}</span> section is currently under development.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`flex-1 overflow-y-auto bg-white p-4 md:p-8 ${showMobilePreview ? 'hidden md:block' : 'block'}`}>
      {renderSection()}
    </div>
  );
};
