import React from 'react';
import { ShieldCheck, CheckCircle2, Check, Sparkles, Target, Zap, Briefcase, GraduationCap } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CreateResumeSidebarProps {
  currentStep: number;
}

export const CreateResumeSidebar: React.FC<CreateResumeSidebarProps> = ({ currentStep }) => {
  return (
    <div className="space-y-6">
      
      {/* Card 1: AI Progress */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5">
        <h3 className="font-semibold text-slate-900 text-base mb-6 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Progress
        </h3>
        <div className="space-y-0">
          <TimelineItem 
            stepNumber={1}
            status={currentStep > 1 ? 'completed' : currentStep === 1 ? 'active' : 'pending'} 
            title="Resume Type Selected" 
            subtitle="Full Time"
          />
          <TimelineItem 
            stepNumber={2}
            status={currentStep > 2 ? 'completed' : currentStep === 2 ? 'active' : 'pending'} 
            title="Personal Information" 
            subtitle="Loaded from your profile"
          />
          <TimelineItem 
            stepNumber={3}
            status={currentStep > 3 ? 'completed' : currentStep === 3 ? 'active' : 'pending'} 
            title="Job Description" 
            subtitle="Add job description to continue"
          />
          <TimelineItem 
            stepNumber={4}
            status={currentStep > 4 ? 'completed' : currentStep === 4 ? 'active' : 'pending'} 
            title="AI Optimization" 
            subtitle="AI will optimize your resume"
          />
          <TimelineItem 
            stepNumber={5}
            status={currentStep > 5 ? 'completed' : currentStep === 5 ? 'active' : 'pending'} 
            title="ATS Analysis" 
            subtitle="Calculating ATS score"
          />
          <TimelineItem 
            stepNumber={6}
            status={currentStep === 6 ? 'completed' : 'pending'} 
            title="Resume Ready" 
            subtitle="Your resume will be ready"
            isLast
          />
        </div>
      </div>

      {/* Card 2: Resume Preview Summary */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-5">
        <h3 className="font-semibold text-slate-900 text-base mb-6">Resume Preview Summary</h3>
        <div className="flex flex-col items-center">
          <div className="relative w-28 h-28 flex flex-col items-center justify-center rounded-full border-8 border-primary/20 mb-6">
            {/* We will add a blue arc border simulation or leave as is */}
            <span className="text-xl font-bold text-slate-400 text-center">
              --<br/><span className="text-sm font-medium">/100</span>
            </span>
          </div>

          <div className="w-full space-y-3">
            <ScoreRow icon={Sparkles} label="ATS Score" score="--" />
            <ScoreRow icon={Target} label="Keyword Match" score="--%" />
            <ScoreRow icon={Zap} label="Skills Match" score="--%" />
            <ScoreRow icon={Briefcase} label="Experience Match" score="--%" />
            <ScoreRow icon={GraduationCap} label="Education Match" score="--%" />
          </div>
        </div>
      </div>

      {/* Card 3: Benefits */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <h3 className="font-semibold text-slate-900 text-base mb-4">What you'll get</h3>
        <ul className="space-y-3">
          <BenefitItem text="ATS-Optimized Resume" />
          <BenefitItem text="Better Keyword Match" />
          <BenefitItem text="Higher Interview Chances" />
          <BenefitItem text="Professional Formatting" />
          <BenefitItem text="Job-Specific Content" />
        </ul>
      </div>

      {/* Card 4: Security Card */}
      <div className="bg-slate-50 rounded-xl border border-primary/20 p-4 flex gap-3 items-center">
        <ShieldCheck className="w-6 h-6 text-primary shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-primary">Your data is secure and private.</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            We never share your information.
          </p>
        </div>
      </div>

    </div>
  );
};

const TimelineItem = ({ stepNumber, status, title, subtitle, isLast }: { stepNumber: number, status: 'completed' | 'active' | 'pending', title: string, subtitle: string, isLast?: boolean }) => {
  return (
    <div className="relative flex gap-4">
      {!isLast && (
        <div className={cn(
          "absolute left-[11px] top-6 bottom-[-8px] w-[2px]",
          status === 'completed' ? "bg-emerald-500" : "bg-slate-200"
        )} />
      )}
      <div className="relative z-10 bg-white">
        {status === 'completed' ? (
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center border-2 border-white">
            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
          </div>
        ) : status === 'active' ? (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold border-2 border-white">
            {stepNumber}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold border-2 border-white">
            {stepNumber}
          </div>
        )}
      </div>
      <div className="pb-6 pt-0.5">
        <div className={cn(
          "text-sm font-semibold",
          status === 'completed' || status === 'active' ? "text-slate-900" : "text-slate-500"
        )}>
          {title}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {subtitle}
        </div>
      </div>
    </div>
  );
};

const ScoreRow = ({ label, score, icon: Icon }: { label: string, score: string | number, icon: any }) => (
  <div className="flex justify-between items-center text-sm py-1.5">
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-slate-600" />
      <span className="text-slate-700 font-medium">{label}</span>
    </div>
    <span className="text-slate-500">{score}</span>
  </div>
);

const BenefitItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3 text-sm text-slate-700 font-medium">
    <div className="bg-primary rounded-full p-0.5">
      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
    </div>
    <span>{text}</span>
  </li>
);
