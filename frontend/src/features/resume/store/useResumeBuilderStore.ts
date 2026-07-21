import { create } from 'zustand';
import { 
  ResumePersonal, ResumeSummary, 
  ResumeExperience, ResumeEducation, ResumeSkill, ResumeProject,
  ResumeCertification, ResumeLanguage, ResumeAchievement,
  ResumeAward, ResumeInterest, ResumeReference
} from '../services/resume.api';

export type BuilderSection = 
  | 'personal' 
  | 'summary' 
  | 'experience' 
  | 'education' 
  | 'skills' 
  | 'projects' 
  | 'certificates'
  | 'languages' 
  | 'achievements'
  | 'awards'
  | 'interests'
  | 'references';

interface ResumeBuilderState {
  activeSection: BuilderSection;
  setActiveSection: (section: BuilderSection) => void;
  
  showMobilePreview: boolean;
  setShowMobilePreview: (show: boolean) => void;
  
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;

  isJdPanelOpen: boolean;
  setIsJdPanelOpen: (isOpen: boolean) => void;

  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  
  lastSavedAt: string | null;
  setLastSavedAt: (time: string) => void;

  livePersonal: ResumePersonal | null;
  setLivePersonal: (personal: ResumePersonal) => void;

  liveSummary: ResumeSummary | null;
  setLiveSummary: (summary: ResumeSummary) => void;

  liveExperiences: ResumeExperience[];
  setLiveExperiences: (experiences: ResumeExperience[]) => void;

  liveEducations: ResumeEducation[];
  setLiveEducations: (educations: ResumeEducation[]) => void;

  liveSkills: ResumeSkill[];
  setLiveSkills: (skills: ResumeSkill[]) => void;

  liveProjects: ResumeProject[];
  setLiveProjects: (projects: ResumeProject[]) => void;

  liveCertifications: ResumeCertification[];
  setLiveCertifications: (certifications: ResumeCertification[]) => void;

  liveLanguages: ResumeLanguage[];
  setLiveLanguages: (languages: ResumeLanguage[]) => void;

  liveAchievements: ResumeAchievement[];
  setLiveAchievements: (achievements: ResumeAchievement[]) => void;

  liveAwards: ResumeAward[];
  setLiveAwards: (awards: ResumeAward[]) => void;

  liveInterests: ResumeInterest[];
  setLiveInterests: (interests: ResumeInterest[]) => void;

  liveReferences: ResumeReference[];
  setLiveReferences: (references: ResumeReference[]) => void;

  // Settings & Presentation State
  liveSettings: {
    selectedTemplate?: string | null;
    defaultTheme?: string | null;
    primaryColor?: string | null;
    fontFamily?: string | null;
    fontSize?: string | null;
    lineSpacing?: string | null;
    sectionSpacing?: string | null;
    pageMargin?: string | null;
    showProfilePhoto?: boolean;
    showIcons?: boolean;
    showSectionDividers?: boolean;
  };
  setLiveSettings: (settings: Partial<ResumeBuilderState['liveSettings']>) => void;

  previewZoom: number;
  setPreviewZoom: (zoom: number) => void;
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  activeSection: 'personal',
  setActiveSection: (section) => set({ activeSection: section, showMobilePreview: false, isSidebarOpen: false }),
  
  showMobilePreview: false,
  setShowMobilePreview: (show) => set({ showMobilePreview: show }),
  
  isSidebarOpen: false,
  setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

  isJdPanelOpen: false,
  setIsJdPanelOpen: (isOpen) => set({ isJdPanelOpen: isOpen }),

  saveStatus: 'idle',
  setSaveStatus: (status) => set({ saveStatus: status }),
  
  lastSavedAt: null,
  setLastSavedAt: (time) => set({ lastSavedAt: time }),

  livePersonal: null,
  setLivePersonal: (personal) => set({ livePersonal: personal }),

  liveSummary: null,
  setLiveSummary: (summary) => set({ liveSummary: summary }),

  liveExperiences: [],
  setLiveExperiences: (experiences) => set({ liveExperiences: experiences }),

  liveEducations: [],
  setLiveEducations: (educations) => set({ liveEducations: educations }),

  liveSkills: [],
  setLiveSkills: (skills) => set({ liveSkills: skills }),

  liveProjects: [],
  setLiveProjects: (projects) => set({ liveProjects: projects }),

  liveCertifications: [],
  setLiveCertifications: (certifications) => set({ liveCertifications: certifications }),

  liveLanguages: [],
  setLiveLanguages: (languages) => set({ liveLanguages: languages }),

  liveAchievements: [],
  setLiveAchievements: (achievements) => set({ liveAchievements: achievements }),

  liveAwards: [],
  setLiveAwards: (awards) => set({ liveAwards: awards }),

  liveInterests: [],
  setLiveInterests: (interests) => set({ liveInterests: interests }),

  liveReferences: [],
  setLiveReferences: (references) => set({ liveReferences: references }),

  liveSettings: {},
  setLiveSettings: (settings) => set((state) => ({ liveSettings: { ...state.liveSettings, ...settings } })),

  previewZoom: 100,
  setPreviewZoom: (zoom) => set({ previewZoom: zoom }),
}));
