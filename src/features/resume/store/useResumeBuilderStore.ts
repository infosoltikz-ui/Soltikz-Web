import { create } from 'zustand';

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
  | 'references';

interface ResumeBuilderState {
  activeSection: BuilderSection;
  setActiveSection: (section: BuilderSection) => void;
  
  showMobilePreview: boolean;
  setShowMobilePreview: (show: boolean) => void;
  
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void;
  
  lastSavedAt: string | null;
  setLastSavedAt: (time: string) => void;
}

export const useResumeBuilderStore = create<ResumeBuilderState>((set) => ({
  activeSection: 'personal',
  setActiveSection: (section) => set({ activeSection: section, showMobilePreview: false }),
  
  showMobilePreview: false,
  setShowMobilePreview: (show) => set({ showMobilePreview: show }),
  
  saveStatus: 'idle',
  setSaveStatus: (status) => set({ saveStatus: status }),
  
  lastSavedAt: null,
  setLastSavedAt: (time) => set({ lastSavedAt: time }),
}));
