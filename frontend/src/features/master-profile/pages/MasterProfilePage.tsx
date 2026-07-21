import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useMasterProfile, useUpdateMasterProfile } from '../hooks/useMasterProfile';
import { MasterProfile } from '../types/masterProfile';
import { useUIStore } from '@store/useUIStore';

// Components
import { StickyProgressSidebar } from '../components/StickyProgressSidebar';
import { StickySaveBar } from '../components/StickySaveBar';

// Sections
import { PersonalInformationSection } from '../components/sections/PersonalInformationSection';
import { EducationSection } from '../components/sections/EducationSection';
import { CertificationsSection } from '../components/sections/CertificationsSection';
import { TechnicalSkillsSection } from '../components/sections/TechnicalSkillsSection';
import { EmploymentHistorySection } from '../components/sections/EmploymentHistorySection';
import { ProjectsSection } from '../components/sections/ProjectsSection';
import { LanguagesSection } from '../components/sections/LanguagesSection';
import { AwardsSection } from '../components/sections/AwardsSection';
import { AchievementsSection } from '../components/sections/AchievementsSection';
import { SocialLinksSection } from '../components/sections/SocialLinksSection';

export const MasterProfilePage: React.FC = () => {
  const { data: profile, isLoading } = useMasterProfile();
  const { mutate: updateProfile } = useUpdateMasterProfile();
  
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeSection, setActiveSection] = useState('personal');

  const methods = useForm<MasterProfile>({
    defaultValues: profile || {},
    mode: 'onBlur',
  });

  const { reset, watch, handleSubmit, formState: { isDirty } } = methods;

  useEffect(() => {
    if (profile) {
      reset(profile);
    }
  }, [profile, reset]);

  // Handle intersection observer for scrolling updates
  const observer = useRef<IntersectionObserver | null>(null);
  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter(entry => entry.isIntersecting);
        if (visibleSections.length > 0) {
          // Find the one that's most visible
          visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(visibleSections[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.current?.observe(section));

    return () => observer.current?.disconnect();
  }, [isLoading]);

  // Scroll to section
  const handleNavigate = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  }, []);

  // Debounced Auto-Save for dirty fields only
  useEffect(() => {
    const subscription = watch((value, { type }) => {
      if (type && isDirty) { // Only save on user interactions that dirty the form
        setSaveStatus('saving');
        const timer = setTimeout(() => {
          handleSubmit((data) => {
            updateProfile(data, {
              onSuccess: () => {
                setSaveStatus('saved');
                reset(data, { keepValues: true, keepDirty: false });
              }
            });
          })();
        }, 5000); // 5s debounce for better UX, maximum 30s requested
        return () => clearTimeout(timer);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, updateProfile, isDirty, reset]);

  // Page Unload / Save Draft / Cancel Handlers
  const handleSaveProfile = handleSubmit((data) => {
    setSaveStatus('saving');
    updateProfile(data, {
      onSuccess: () => {
        setSaveStatus('saved');
        reset(data, { keepValues: true, keepDirty: false });
        useUIStore.getState().toast.success('Master Profile saved successfully');
      }
    });
  });

  const handleCancel = () => {
    if (profile) {
      reset(profile); // Revert to last backend state
      setSaveStatus('idle');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex gap-6">
        <div className="w-1/4 h-64 bg-slate-100 animate-pulse rounded-xl" />
        <div className="flex-1 space-y-6">
          <div className="h-96 bg-slate-100 animate-pulse rounded-xl" />
          <div className="h-64 bg-slate-100 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} className="relative pb-24">
        <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          <StickyProgressSidebar 
            profile={profile} 
            activeSection={activeSection}
            onNavigate={handleNavigate}
            saveStatus={saveStatus}
          />

          {/* Main Form Content */}
          <div className="flex-1 space-y-8 lg:min-w-0">
            <PersonalInformationSection />
            <EducationSection />
            <CertificationsSection />
            <TechnicalSkillsSection />
            <EmploymentHistorySection />
            <ProjectsSection />
            <LanguagesSection />
            <AwardsSection />
            <AchievementsSection />
            <SocialLinksSection />
          </div>
        </div>

        <StickySaveBar 
          saveStatus={saveStatus}
          onSaveDraft={handleSaveProfile}
          onSaveProfile={handleSaveProfile}
          onCancel={handleCancel}
        />
      </form>
    </FormProvider>
  );
};
