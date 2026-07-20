import React, { useState } from 'react';
import { Type, FileText, UploadCloud } from 'lucide-react';
import { UseFormRegister, FieldErrors, UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { cn } from '@/utils/cn';

interface JobDescriptionSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
}

export const JobDescriptionSection: React.FC<JobDescriptionSectionProps> = ({ register, errors, watch, setValue }) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'pdf' | 'docx'>('paste');
  const jobDescription = watch('jobDescription') || '';

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Logic for handling file drop would go here
      // For now, it will just show a UI interaction
      const file = files[0];
      if (file.type === 'application/pdf') setActiveTab('pdf');
      else setActiveTab('docx');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">4. Job Description</h2>
      
      <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-2">
        <TabButton 
          active={activeTab === 'paste'} 
          onClick={() => setActiveTab('paste')} 
          icon={Type} 
          label="Paste Text" 
        />
        <TabButton 
          active={activeTab === 'pdf'} 
          onClick={() => setActiveTab('pdf')} 
          icon={FileText} 
          label="Upload PDF" 
        />
        <TabButton 
          active={activeTab === 'docx'} 
          onClick={() => setActiveTab('docx')} 
          icon={FileText} 
          label="Upload DOCX" 
        />
      </div>

      {activeTab === 'paste' ? (
        <div className="relative">
          <textarea
            {...register('jobDescription', { 
              required: 'Job description is required',
              maxLength: { value: 5000, message: 'Maximum 5000 characters allowed' }
            })}
            placeholder="Paste the complete job description here..."
            className={cn(
              "w-full min-h-[250px] p-4 bg-slate-50 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-opacity-20 resize-y",
              errors.jobDescription 
                ? "border-red-300 focus:ring-red-500 focus:bg-white" 
                : "border-slate-200 focus:border-primary focus:ring-primary focus:bg-white hover:border-slate-300"
            )}
          />
          <div className="absolute bottom-3 right-3 text-xs font-medium text-slate-400 bg-white/80 px-2 py-1 rounded backdrop-blur-sm">
            <span className={jobDescription.length > 5000 ? 'text-red-500' : ''}>
              {jobDescription.length}
            </span>
            /5000
          </div>
          {errors.jobDescription && (
            <p className="mt-1 text-xs text-red-500">{errors.jobDescription.message as string}</p>
          )}
        </div>
      ) : (
        <div 
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer min-h-[250px]"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-primary">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 mb-1">
            Upload your {activeTab.toUpperCase()} file
          </h3>
          <p className="text-sm text-slate-500 mb-4 text-center max-w-xs">
            Drag and drop your file here, or click to browse from your computer.
          </p>
          <button type="button" className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            Select File
          </button>
        </div>
      )}
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
        active 
          ? "bg-primary-50 text-primary-700" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
};
