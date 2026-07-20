import React, { useState } from 'react';
import { X, FileText, Briefcase, GraduationCap, Code, Building2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useCreateResume } from '../hooks/resume.queries';
import { useNavigate } from 'react-router-dom';

interface ResumeCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

const RESUME_TYPES = [
  { id: 'FULLTIME', label: 'Full-Time Role', icon: Briefcase, desc: 'Standard professional resume for full-time employment.' },
  { id: 'C2C', label: 'Contract (C2C)', icon: Building2, desc: 'Optimized for B2B consulting and contracting roles.' },
  { id: 'INTERNSHIP', label: 'Internship', icon: GraduationCap, desc: 'Highlights education, projects, and potential for students.' },
  { id: 'FREELANCE', label: 'Freelance', icon: Code, desc: 'Showcases specific gig work and diverse client projects.' },
  { id: 'GOVERNMENT', label: 'Government', icon: FileText, desc: 'Detailed, highly structured format for federal/state jobs.' }
];

export const ResumeCreationWizard: React.FC<ResumeCreationWizardProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [resumeType, setResumeType] = useState('FULLTIME');
  const [title, setTitle] = useState('');
  
  const createMutation = useCreateResume();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNext = () => {
    if (step === 1) setStep(2);
  };

  const handleCreate = () => {
    if (!title.trim()) return;
    
    // We pass the required data to the backend Clone Engine
    createMutation.mutate({ title, resumeType: resumeType as any }, {
      onSuccess: (response: any) => {
        // The backend returns the newly cloned Resume Draft ID
        onClose();
        // Redirect to the Workspace editor
        // Sometimes the response is unwrapped by Axios, sometimes it's nested
        const resumeId = response?.data?.id || response?.id;
        if (resumeId) {
          navigate(`/dashboard/resumes/${resumeId}/edit`);
        }
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Create New Resume</h2>
            <p className="text-sm text-slate-500 mt-1">Step {step} of 2: {step === 1 ? 'Select Format' : 'Resume Details'}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-slate-700 font-medium mb-4">What type of role are you applying for?</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RESUME_TYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setResumeType(type.id)}
                    className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all ${
                      resumeType === type.id 
                        ? 'border-blue-600 bg-blue-50' 
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`p-2 w-fit rounded-lg mb-3 ${resumeType === type.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <type.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{type.label}</h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">{type.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                <p className="text-sm text-blue-800 font-medium">
                  We will securely clone your Master Profile into a new Draft. Your Master Profile will remain completely unchanged when you edit this new Resume.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Resume Name *</label>
                <input
                  autoFocus
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Engineer - Google"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-slate-500 mt-2">Only you can see this name.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
          {step === 2 ? (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          ) : (
            <div /> // Spacer
          )}
          
          {step === 1 ? (
            <Button onClick={handleNext} className="gap-2">
              Continue <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleCreate} 
              disabled={!title.trim() || createMutation.isPending}
              loading={createMutation.isPending}
            >
              Generate Draft
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
