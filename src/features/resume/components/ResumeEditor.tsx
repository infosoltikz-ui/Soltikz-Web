import React, { useEffect } from 'react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { useResume } from '../hooks/resume.queries';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceSection } from './experience/ExperienceSection';
import { EducationSection } from './education/EducationSection';
import { SkillsSection } from './skills/SkillsSection';
import { ProjectsSection } from './projects/ProjectsSection';
import { CertificationSection } from './certifications/CertificationSection';
import { LanguageSection } from './languages/LanguageSection';
import { AchievementSection } from './achievements/AchievementSection';
import { AwardSection } from './awards/AwardSection';
import { InterestSection } from './interests/InterestSection';
import { ReferenceSection } from './references/ReferenceSection';
import { Loader2 } from 'lucide-react';

interface ResumeEditorProps {
  resumeId: string;
}

const SECTION_TITLES: Record<string, string> = {
  personal: 'Personal Details',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certificates: 'Certifications',
  languages: 'Languages',
  achievements: 'Achievements',
  awards: 'Awards',
  interests: 'Interests & Hobbies',
  references: 'References',
};

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ resumeId }) => {
  const {
    activeSection,
    setLivePersonal, setLiveSummary,
    setLiveExperiences, setLiveEducations, setLiveSkills, setLiveProjects,
    setLiveCertifications, setLiveLanguages, setLiveAchievements,
    setLiveAwards, setLiveInterests, setLiveReferences,
  } = useResumeBuilderStore();
  const { data: resume, isLoading, error } = useResume(resumeId);

  // Initialize live preview state when resume loads
  useEffect(() => {
    if (resume) {
      if (resume.personal) setLivePersonal(resume.personal);
      if (resume.summary) setLiveSummary(resume.summary);
      setLiveExperiences(resume.experiences || []);
      setLiveEducations(resume.educations || []);
      setLiveSkills(resume.skills || []);
      setLiveProjects(resume.projects || []);
      setLiveCertifications(resume.certifications || []);
      setLiveLanguages(resume.languages || []);
      setLiveAchievements(resume.achievements || []);
      setLiveAwards(resume.awards || []);
      setLiveInterests(resume.interests || []);
      setLiveReferences(resume.references || []);
    }
  }, [resume]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-slate-500 font-medium">Loading resume...</p>
        </div>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50/50">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-slate-900">Failed to load resume</h3>
          <p className="text-slate-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const sectionTitle = SECTION_TITLES[activeSection] || activeSection;

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50/50 custom-scrollbar">
      <div className="max-w-3xl mx-auto p-4 md:p-8 lg:p-12">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[calc(100vh-12rem)]">
          {/* Personal & Summary: rendered with their own heading */}
          {activeSection === 'personal' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Personal Details</h2>
              <PersonalInfoForm resume={resume} />
            </div>
          )}

          {activeSection === 'summary' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Professional Summary</h2>
              <SummaryForm resume={resume} />
            </div>
          )}

          {/* Existing sections (render their own heading internally) */}
          {activeSection === 'experience' && <ExperienceSection resume={resume} />}
          {activeSection === 'education' && <EducationSection resume={resume} />}
          {activeSection === 'skills' && <SkillsSection resume={resume} />}
          {activeSection === 'projects' && <ProjectsSection resume={resume} />}

          {/* Sprint 3.4 Sections */}
          {activeSection === 'certificates' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Certifications</h2>
              <p className="text-slate-500 text-sm mb-6">Add your professional certifications and credentials.</p>
              <CertificationSection resumeId={resumeId} certifications={resume.certifications || []} />
            </div>
          )}

          {activeSection === 'languages' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Languages</h2>
              <p className="text-slate-500 text-sm mb-6">Highlight the languages you speak and your proficiency level.</p>
              <LanguageSection resumeId={resumeId} languages={resume.languages || []} />
            </div>
          )}

          {activeSection === 'achievements' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Achievements</h2>
              <p className="text-slate-500 text-sm mb-6">Showcase your most notable accomplishments and milestones.</p>
              <AchievementSection resumeId={resumeId} achievements={resume.achievements || []} />
            </div>
          )}

          {activeSection === 'awards' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Awards & Recognition</h2>
              <p className="text-slate-500 text-sm mb-6">Add awards and recognition you've received.</p>
              <AwardSection resumeId={resumeId} awards={resume.awards || []} />
            </div>
          )}

          {activeSection === 'interests' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">Interests & Hobbies</h2>
              <p className="text-slate-500 text-sm mb-6">Show your personality with interests outside of work.</p>
              <InterestSection resumeId={resumeId} interests={resume.interests || []} />
            </div>
          )}

          {activeSection === 'references' && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-2xl font-bold text-slate-900 mb-1">References</h2>
              <p className="text-slate-500 text-sm mb-6">Add professional references or mark them as available upon request.</p>
              <ReferenceSection resumeId={resumeId} references={resume.references || []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
