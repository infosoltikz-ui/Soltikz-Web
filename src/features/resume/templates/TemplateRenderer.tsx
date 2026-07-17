import React, { useMemo } from 'react';
import { Resume } from '../services/resume.api';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { getTemplateById } from './resume.templates';

// We'll import these as we create them
import ModernTemplate from './Modern/ModernTemplate';
import ProfessionalTemplate from './Professional/ProfessionalTemplate';
import ExecutiveTemplate from './Executive/ExecutiveTemplate';
import MinimalTemplate from './Minimal/MinimalTemplate';
import CreativeTemplate from './Creative/CreativeTemplate';

interface TemplateRendererProps {
  resume: Resume;
}

export const TemplateRenderer: React.FC<TemplateRendererProps> = ({ resume }) => {
  const { 
    livePersonal, 
    liveSummary,
    liveExperiences,
    liveEducations,
    liveSkills,
    liveProjects,
    liveCertifications,
    liveLanguages,
    liveAchievements,
    liveAwards,
    liveInterests,
    liveReferences,
    liveSettings
  } = useResumeBuilderStore();

  // Merge database resume with live zustand state
  const data = useMemo(() => {
    return {
      personal: { ...resume.personal, ...livePersonal },
      summary: { ...resume.summary, ...liveSummary },
      experiences: liveExperiences.length > 0 ? liveExperiences : resume.experiences || [],
      educations: liveEducations.length > 0 ? liveEducations : resume.educations || [],
      skills: liveSkills.length > 0 ? liveSkills : resume.skills || [],
      projects: liveProjects.length > 0 ? liveProjects : resume.projects || [],
      certifications: liveCertifications.length > 0 ? liveCertifications : resume.certifications || [],
      languages: liveLanguages.length > 0 ? liveLanguages : resume.languages || [],
      achievements: liveAchievements.length > 0 ? liveAchievements : resume.achievements || [],
      awards: liveAwards.length > 0 ? liveAwards : resume.awards || [],
      interests: liveInterests.length > 0 ? liveInterests : resume.interests || [],
      references: liveReferences.length > 0 ? liveReferences : resume.references || [],
    };
  }, [resume, livePersonal, liveSummary, liveExperiences, liveEducations, liveSkills, liveProjects, liveCertifications, liveLanguages, liveAchievements, liveAwards, liveInterests, liveReferences]);

  // Combine Settings
  const settings = {
    selectedTemplate: liveSettings.selectedTemplate ?? resume.selectedTemplate ?? 'modern',
    defaultTheme: liveSettings.defaultTheme ?? resume.defaultTheme ?? 'blue',
    primaryColor: liveSettings.primaryColor ?? resume.primaryColor ?? '#2563eb',
    fontFamily: liveSettings.fontFamily ?? resume.fontFamily ?? 'inter',
    fontSize: liveSettings.fontSize ?? resume.fontSize ?? 'medium',
    lineSpacing: liveSettings.lineSpacing ?? resume.lineSpacing ?? 'normal',
    sectionSpacing: liveSettings.sectionSpacing ?? resume.sectionSpacing ?? 'comfortable',
    pageMargin: liveSettings.pageMargin ?? resume.pageMargin ?? 'medium',
    showProfilePhoto: liveSettings.showProfilePhoto ?? resume.showProfilePhoto ?? true,
    showIcons: liveSettings.showIcons ?? resume.showIcons ?? true,
    showSectionDividers: liveSettings.showSectionDividers ?? resume.showSectionDividers ?? true,
  };

  const templateDef = getTemplateById(settings.selectedTemplate);
  const color = settings.primaryColor || templateDef.primaryColor;

  // Apply CSS Variables for typography and spacing to the root wrapper
  const styleVars = {
    '--primary-color': color,
    '--font-family': getFontFamily(settings.fontFamily),
    '--base-font-size': getFontSize(settings.fontSize),
    '--line-height': getLineSpacing(settings.lineSpacing),
    '--section-spacing': getSectionSpacing(settings.sectionSpacing),
    '--page-margin': getPageMargin(settings.pageMargin),
  } as React.CSSProperties;

  const renderTemplate = () => {
    switch (settings.selectedTemplate) {
      case 'modern': return <ModernTemplate data={data} settings={settings} />;
      case 'professional': return <ProfessionalTemplate data={data} settings={settings} />;
      case 'executive': return <ExecutiveTemplate data={data} settings={settings} />;
      case 'minimal': return <MinimalTemplate data={data} settings={settings} />;
      case 'creative': return <CreativeTemplate data={data} settings={settings} />;
      default: return <ModernTemplate data={data} settings={settings} />;
    }
  };

  return (
    <div className="resume-template-root bg-white w-full h-full text-slate-800" style={styleVars}>
      {renderTemplate()}
    </div>
  );
};

// Helper functions for mapping settings to CSS values
const getFontFamily = (font: string) => {
  const map: Record<string, string> = {
    inter: '"Inter", sans-serif',
    roboto: '"Roboto", sans-serif',
    poppins: '"Poppins", sans-serif',
    lato: '"Lato", sans-serif',
    opensans: '"Open Sans", sans-serif',
    merriweather: '"Merriweather", serif',
    georgia: 'Georgia, serif',
    times: '"Times New Roman", serif',
  };
  return map[font] || map.inter;
};

const getFontSize = (size: string) => {
  const map: Record<string, string> = {
    small: '13px',
    medium: '15px',
    large: '17px',
  };
  return map[size] || map.medium;
};

const getLineSpacing = (spacing: string) => {
  const map: Record<string, string> = {
    compact: '1.3',
    normal: '1.6',
    relaxed: '1.9',
  };
  return map[spacing] || map.normal;
};

const getSectionSpacing = (spacing: string) => {
  const map: Record<string, string> = {
    compact: '16px',
    comfortable: '24px',
    spacious: '36px',
  };
  return map[spacing] || map.comfortable;
};

const getPageMargin = (margin: string) => {
  const map: Record<string, string> = {
    small: '24px',
    medium: '40px',
    large: '56px',
  };
  return map[margin] || map.medium;
};
