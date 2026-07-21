import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Medal,
  Heart,
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
  { id: 'certificates', label: 'Certifications', icon: Award },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'awards', label: 'Awards & Recognition', icon: Medal },
  { id: 'interests', label: 'Interests & Hobbies', icon: Heart },
  { id: 'references', label: 'References', icon: Users },
];

export const ResumeSidebar: React.FC<ResumeSidebarProps> = ({ resume }) => {
  const { 
    activeSection, setActiveSection, showMobilePreview, isSidebarOpen, setIsSidebarOpen, 
    livePersonal, liveSummary, liveExperiences, liveEducations, liveSkills, liveProjects,
    liveCertifications, liveLanguages, liveAchievements, liveAwards, liveInterests, liveReferences,
  } = useResumeBuilderStore();

  const personal = { ...resume.personal, ...livePersonal };
  const summary = { ...resume.summary, ...liveSummary };
  const experiences = liveExperiences.length > 0 ? liveExperiences : resume.experiences || [];
  const educations = liveEducations.length > 0 ? liveEducations : resume.educations || [];
  const skills = liveSkills.length > 0 ? liveSkills : resume.skills || [];
  const projects = liveProjects.length > 0 ? liveProjects : resume.projects || [];

  const checkCompletion = (sectionId: BuilderSection) => {
    switch (sectionId) {
      case 'personal':
        return !!(personal.firstName && personal.lastName && personal.email && personal.phone);
      case 'summary':
        return !!(summary.content && summary.content.trim().length > 10);
      case 'experience':
        return experiences.length > 0 && experiences.some((e: any) => e.companyName && e.jobTitle);
      case 'education':
        return educations.length > 0 && educations.some((e: any) => e.institution);
      case 'skills':
        return skills.length > 0 && skills.some((s: any) => s.name);
      case 'projects':
        return projects.length > 0 && projects.some((p: any) => p.title);
      case 'certificates':
        return liveCertifications.length > 0;
      case 'languages':
        return liveLanguages.length > 0;
      case 'achievements':
        return liveAchievements.length > 0;
      case 'awards':
        return liveAwards.length > 0;
      case 'interests':
        return liveInterests.length > 0;
      case 'references':
        return liveReferences.length > 0;
      default:
        return false;
    }
  };

  // Weighted completion: 12 sections with different weights
  const SECTION_WEIGHTS: Record<BuilderSection, number> = {
    personal: 15,
    summary: 10,
    experience: 20,
    education: 15,
    skills: 10,
    projects: 10,
    certificates: 5,
    languages: 5,
    achievements: 5,
    awards: 2.5,
    interests: 1.25,
    references: 1.25,
  };

  const dynamicCompletion = Math.round(
    SECTIONS.reduce((acc, s) => acc + (checkCompletion(s.id) ? SECTION_WEIGHTS[s.id] : 0), 0)
  );
  const displayCompletion = Math.max(dynamicCompletion, resume.completionPercentage || 0);

  // When preview is active on mobile, hide the drawer entirely so it doesn't conflict
  if (showMobilePreview) {
    return null;
  }

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/30 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar Drawer */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 md:z-0 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col flex-shrink-0 h-[calc(100vh-4rem)] md:h-full overflow-y-auto",
        "w-[85%] max-w-sm md:w-64 bg-slate-50 md:bg-white md:border-r border-slate-200 mt-16 md:mt-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 md:border-b border-slate-100 md:block">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion</h2>
              <span className="text-xs font-bold text-primary-600">{displayCompletion}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-primary-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${displayCompletion}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
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
                onClick={() => {
                  setActiveSection(section.id);
                  setIsSidebarOpen(false); // Auto close drawer on mobile when navigating
                }}
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
                  {isCompleted && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        isActive ? "bg-primary-500" : "bg-emerald-500"
                      )} 
                    />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
