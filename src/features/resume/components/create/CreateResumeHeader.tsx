import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export const CreateResumeHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500 hover:text-slate-900"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Create New Resume</h1>
          <p className="text-sm text-slate-500 mt-1">
            Fill in the details and job description to generate your ATS-optimized resume.
          </p>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={() => navigate('/dashboard/resumes')}
        className="text-sm font-medium"
      >
        Back to Dashboard
      </Button>
    </div>
  );
};
