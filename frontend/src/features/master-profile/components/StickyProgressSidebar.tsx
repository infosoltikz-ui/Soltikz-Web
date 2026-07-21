import React from 'react';
import { MasterProfile } from '../types/masterProfile';
import { CheckCircle2, Circle, XCircle } from 'lucide-react';

interface SidebarProps {
  profile?: MasterProfile;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  saveStatus: 'idle' | 'saving' | 'saved';
}

export const StickyProgressSidebar: React.FC<SidebarProps> = ({ 
  profile, 
  activeSection, 
  onNavigate,
  saveStatus 
}) => {

  const checkSection = (condition: boolean) => condition ? 'completed' : 'missing';

  const sections = [
    { id: 'personal', label: 'Personal Info', status: checkSection(!!(profile?.firstName && profile?.email)) },
    { id: 'education', label: 'Education', status: checkSection(!!(profile?.educations && profile.educations.length > 0)) },
    { id: 'certifications', label: 'Certifications', status: checkSection(!!(profile?.certifications && profile.certifications.length > 0)) },
    { id: 'skills', label: 'Technical Skills', status: checkSection(!!(profile?.skills && profile.skills.length > 0)) },
    { id: 'employment', label: 'Employment History', status: checkSection(!!(profile?.employments && profile.employments.length > 0)) },
    { id: 'projects', label: 'Projects', status: checkSection(!!(profile?.projects && profile.projects.length > 0)) },
    { id: 'languages', label: 'Languages', status: checkSection(!!(profile?.languages && profile.languages.length > 0)) },
    { id: 'awards', label: 'Awards', status: checkSection(!!(profile?.awards && profile.awards.length > 0)) },
    { id: 'achievements', label: 'Achievements', status: checkSection(!!(profile?.achievements && profile.achievements.length > 0)) },
    { id: 'socialLinks', label: 'Social Links', status: checkSection(!!(profile?.socialLinks && profile.socialLinks.length > 0)) },
  ];

  return (
    <div className="w-1/4 bg-white p-6 rounded-xl border border-slate-200 h-fit sticky top-6 shadow-sm hidden lg:block">
      <h2 className="font-semibold text-slate-900 mb-4">Profile Completeness</h2>
      <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
        <div 
          className="bg-blue-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${profile?.completionPercentage || 0}%` }}
        />
      </div>
      <p className="text-sm font-medium text-slate-600 mb-6">{profile?.completionPercentage || 0}% Complete</p>
      
      <div className="space-y-1 mb-8">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => onNavigate(sec.id)}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeSection === sec.id 
                ? 'bg-blue-50 text-blue-700' 
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>{sec.label}</span>
            {sec.status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300" />
            )}
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Status Overview</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-1">Completed</span>
              {sections.filter(s => s.status === 'completed').map(s => s.label).join(', ') || 'None'}
            </div>
          </div>
          <div className="flex items-start gap-2 mt-3">
            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-600">
              <span className="font-semibold text-slate-800 block mb-1">Missing</span>
              {sections.filter(s => s.status === 'missing').map(s => s.label).join(', ') || 'None'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
