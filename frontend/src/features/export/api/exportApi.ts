import api from '@/utils/axios';

export const exportApi = {
  exportResume: async (resumeId: string, format: string, options: any = {}) => {
    const response = await api.post(`/export/${resumeId}/format`, { format, options }, { responseType: 'blob' });
    return response.data;
  },
  
  getExportHistory: async (resumeId: string) => {
    const response = await api.get(`/export/${resumeId}/history`);
    return response.data;
  },
  
  createShareLink: async (resumeId: string, payload: { type: string, expiresInDays?: number, password?: string }) => {
    const response = await api.post(`/export/${resumeId}/share`, payload);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/export/analytics');
    return response.data;
  }
};
