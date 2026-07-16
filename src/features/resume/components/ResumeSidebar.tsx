import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  FileText, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Award, 
  Languages, 
  Trophy,
  Users
} from 'lucide-react';
import { useResumeBuilderStore, BuilderSection } from '../store/useResumeBuilderStore';
import { Resume } from '../services/resume.api';
import { cn } from '@/utils/cn';

interface ResumeSidebarProps {
  resume: Resume;
}

const SECTIONS: { id: BuilderSection; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: 'Personal Details', icon: User },
  { id: 'summary', label: 'Professional Summary', icon: FileText },
  { id: 'experience', label: 'Employment History', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'references', label: 'References', icon: Users },
];

export const ResumeSidebar: React.FC<ResumeSidebarProps> = ({ resume }) => {
  const { activeSection, setActiveSection, showMobilePreview } = useResumeBuilderStore();

  const checkCompletion = (sectionId: BuilderSection) => {
    if (sectionId === 'personal') return !!(resume.personal?.firstName && resume.personal?.email);
    if (sectionId === 'summary') return !!resume.summary?.content;
    return false; // Other sections not implemented yet
  };

  return (
    <aside className={cn(
      "w-full md:w-64 bg-slate-50 md:bg-white md:border-r border-slate-200 flex-shrink-0 flex-col h-full overflow-y-auto",
      showMobilePreview ? 'hidden md:flex' : 'flex'
    )}>
      <div className="p-4 md:border-b border-slate-100 hidden md:block">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion</h2>
            <span className="text-xs font-bold text-primary-600">{resume.completionPercentage}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${resume.completionPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {SECTIONS.map((section) => {
          const isActive = activeSection === section.id;
          const isCompleted = checkCompletion(section.id);
          const Icon = section.icon;

          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative",
                isActive ? "text-primary-700 bg-primary-50" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-3 relative z-10">
                <Icon className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600"
                )} />
                {section.label}
              </div>
              
              <div className="relative z-10 flex items-center">
                {isCompleted && !isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};
