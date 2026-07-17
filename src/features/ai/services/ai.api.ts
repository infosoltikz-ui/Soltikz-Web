import api from '@/utils/axios';

export interface AISettings {
  id: string;
  provider: string;
  preferredModel: string;
  temperature: number;
  maxTokens: number;
  stream: boolean;
  language: string;
  tone: string;
}

export interface GenerateAIRequest {
  promptType: string;
  variables: Record<string, string>;
  resumeId?: string;
  conversationId?: string;
}

export interface GenerateAIResponse {
  success: boolean;
  provider: string;
  model: string;
  message: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  latency: number;
  cost: number;
  response: string;
}

export const aiApi = {
  getSettings: async (): Promise<AISettings> => {
    const res = await api.get('/ai/settings');
    return res.data;
  },

  updateSettings: async (settings: Partial<AISettings>): Promise<AISettings> => {
    const res = await api.put('/ai/settings', settings);
    return res.data;
  },

  getHistory: async () => {
    const res = await api.get('/ai/history');
    return res.data;
  },

  generate: async (data: GenerateAIRequest): Promise<GenerateAIResponse> => {
    const res = await api.post('/ai/generate', data);
    return res.data;
  },

  // --- Platform APIs ---
  getHealth: async () => {
    const res = await api.get('/ai/health');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/ai/analytics');
    return res.data;
  },

  getPrompts: async () => {
    const res = await api.get('/ai/prompts');
    return res.data;
  },

  clearCache: async () => {
    const res = await api.post('/ai/cache/clear');
    return res.data;
  }
};
