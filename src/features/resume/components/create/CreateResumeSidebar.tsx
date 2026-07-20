import React from 'react';
import { ShieldCheck, CheckCircle2, Circle, Clock, Check } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CreateResumeSidebarProps {
  currentStep: number;
}

export const CreateResumeSidebar: React.FC<CreateResumeSidebarProps> = ({ currentStep }) => {
  return (
    <div className="space-y-6">
      
      {/* Card 1: AI Progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-4">
          <h3 className="font-semibold text-slate-900 text-sm">AI Progress</h3>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <TimelineItem 
              status={currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending'} 
              title="Resume Type Selected" 
            />
            <TimelineItem 
              status={currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'} 
              title="Personal Information Loaded" 
            />
            <TimelineItem 
              status={currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending'} 
              title="Job Description" 
            />
            <TimelineItem 
              status={currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending'} 
              title="AI Optimization" 
            />
            <TimelineItem 
              status={currentStep > 5 ? 'completed' : currentStep === 5 ? 'active' : 'pending'} 
              title="ATS Analysis" 
            />
            <TimelineItem 
              status={currentStep === 6 ? 'completed' : 'pending'} 
              title="Resume Ready" 
              isLast
            />
          </div>
        </div>
      </div>

      {/* Card 2: Resume Preview Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-100 p-4">
          <h3 className="font-semibold text-slate-900 text-sm">Resume Preview Summary</h3>
        </div>
        <div className="p-5 flex flex-col items-center">
          <div className="relative w-32 h-32 flex flex-col items-center justify-center rounded-full border-[6px] border-slate-100 mb-6">
            <span className="text-3xl font-bold text-slate-400">--</span>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">ATS Score</span>
          </div>

          <div className="w-full space-y-3">
            <ScoreRow label="Keyword Match" score="--" />
            <ScoreRow label="Skills Match" score="--" />
            <ScoreRow label="Experience Match" score="--" />
            <ScoreRow label="Education Match" score="--" />
          </div>
        </div>
      </div>

      {/* Card 3: Benefits */}
      <div className="bg-primary-50 rounded-xl border border-primary-100 p-5">
        <h3 className="font-semibold text-primary-900 text-sm mb-3">Benefits</h3>
        <ul className="space-y-2.5">
          <BenefitItem text="ATS Optimized Resume" />
          <BenefitItem text="Better Keyword Match" />
          <BenefitItem text="Higher Interview Chances" />
          <BenefitItem text="Professional Formatting" />
          <BenefitItem text="Job Specific Content" />
        </ul>
      </div>

      {/* Card 4: Security Card */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 flex gap-3 items-start">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Your data is secure and private.</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            We never share your information. All data is encrypted and securely stored.
          </p>
        </div>
      </div>

    </div>
  );
};

const TimelineItem = ({ status, title, isLast }: { status: 'completed' | 'active' | 'pending', title: string, isLast?: boolean }) => {
  return (
    <div className="relative flex gap-3">
      {!isLast && (
        <div className={cn(
          "absolute left-2.5 top-6 bottom-[-16px] w-0.5",
          status === 'completed' ? "bg-emerald-500" : "bg-slate-200"
        )} />
      )}
      <div className="relative z-10 bg-white">
        {status === 'completed' ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-white" />
        ) : status === 'active' ? (
          <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center bg-white">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        ) : (
          <Circle className="w-5 h-5 text-slate-300 fill-white" />
        )}
      </div>
      <div className={cn(
        "text-sm font-medium pb-4",
        status === 'completed' ? "text-slate-900" : status === 'active' ? "text-primary-700 font-semibold" : "text-slate-400"
      )}>
        {title}
      </div>
    </div>
  );
};

const ScoreRow = ({ label, score }: { label: string, score: string | number }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-slate-600">{label}</span>
    <span className="font-semibold text-slate-900">{score}</span>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-2 text-sm text-primary-800">
    <Check className="w-4 h-4 shrink-0 mt-0.5 text-primary-600" />
    <span>{text}</span>
  </li>
);
