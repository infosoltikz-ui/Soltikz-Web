import { create } from 'zustand';

export interface AIMessageType {
  id: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  createdAt: Date;
  tokens?: number;
  cost?: number;
  model?: string;
  provider?: string;
}

interface AIState {
  isGenerating: boolean;
  isSidebarOpen: boolean;
  currentConversationId: string | null;
  messages: AIMessageType[];
  streamingMessage: string;
  
  setIsGenerating: (isGenerating: boolean) => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCurrentConversationId: (id: string | null) => void;
  setMessages: (messages: AIMessageType[]) => void;
  addMessage: (message: AIMessageType) => void;
  setStreamingMessage: (chunk: string | ((prev: string) => string)) => void;
  clearStreamingMessage: () => void;
  
  isAdminDashboardOpen: boolean;
  setAdminDashboardOpen: (isOpen: boolean) => void;
  
  // Summary Generator State (Legacy/Specific)
  summaryLoading: boolean;
  setSummaryLoading: (loading: boolean) => void;
  generatedSummary: string;
  setGeneratedSummary: (summary: string) => void;
  selectedSummary: string;
  setSelectedSummary: (summary: string) => void;
  isSummaryGeneratorOpen: boolean;
  setSummaryGeneratorOpen: (isOpen: boolean) => void;

  // Generic Generator State
  isGeneratorOpen: boolean;
  setGeneratorOpen: (isOpen: boolean) => void;
  generatorType: 'summary' | 'experience' | 'skills' | 'project' | 'achievement' | null;
  setGeneratorType: (type: 'summary' | 'experience' | 'skills' | 'project' | 'achievement' | null) => void;
  generatorSelectedId: string | null;
  setGeneratorSelectedId: (id: string | null) => void;

  // Experience Rewriter State
  experienceLoading: boolean;
  setExperienceLoading: (loading: boolean) => void;
  rewrittenExperience: string;
  setRewrittenExperience: (experience: string) => void;

  // Skills Generator State
  skillsLoading: boolean;
  setSkillsLoading: (loading: boolean) => void;
  generatedSkills: string;
  setGeneratedSkills: (skills: string) => void;

  // Project Generator State
  projectLoading: boolean;
  setProjectLoading: (loading: boolean) => void;
  generatedProject: string;
  setGeneratedProject: (project: string) => void;

  // Achievement Generator State
  achievementLoading: boolean;
  setAchievementLoading: (loading: boolean) => void;
  generatedAchievement: string;
  setGeneratedAchievement: (achievement: string) => void;
}

export const useAIStore = create<AIState>((set) => ({
  isGenerating: false,
  isSidebarOpen: false,
  currentConversationId: null,
  messages: [],
  streamingMessage: '',
  
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setCurrentConversationId: (id) => set({ currentConversationId: id }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setStreamingMessage: (chunk) => set((state) => ({
    streamingMessage: typeof chunk === 'function' ? chunk(state.streamingMessage) : chunk
  })),
  clearStreamingMessage: () => set({ streamingMessage: '' }),
  
  isAdminDashboardOpen: false,
  setAdminDashboardOpen: (isOpen) => set({ isAdminDashboardOpen: isOpen }),
  
  summaryLoading: false,
  setSummaryLoading: (loading) => set({ summaryLoading: loading }),
  generatedSummary: '',
  setGeneratedSummary: (summary) => set({ generatedSummary: summary }),
  selectedSummary: '',
  setSelectedSummary: (summary) => set({ selectedSummary: summary }),
  isSummaryGeneratorOpen: false,
  setSummaryGeneratorOpen: (isOpen) => set({ isSummaryGeneratorOpen: isOpen }),

  isGeneratorOpen: false,
  setGeneratorOpen: (isOpen) => set({ isGeneratorOpen: isOpen }),
  generatorType: null,
  setGeneratorType: (type) => set({ generatorType: type }),
  generatorSelectedId: null,
  setGeneratorSelectedId: (id) => set({ generatorSelectedId: id }),

  experienceLoading: false,
  setExperienceLoading: (loading) => set({ experienceLoading: loading }),
  rewrittenExperience: '',
  setRewrittenExperience: (experience) => set({ rewrittenExperience: experience }),

  skillsLoading: false,
  setSkillsLoading: (loading) => set({ skillsLoading: loading }),
  generatedSkills: '',
  setGeneratedSkills: (skills) => set({ generatedSkills: skills }),

  projectLoading: false,
  setProjectLoading: (loading) => set({ projectLoading: loading }),
  generatedProject: '',
  setGeneratedProject: (project) => set({ generatedProject: project }),

  achievementLoading: false,
  setAchievementLoading: (loading) => set({ achievementLoading: loading }),
  generatedAchievement: '',
  setGeneratedAchievement: (achievement) => set({ generatedAchievement: achievement })
}));
