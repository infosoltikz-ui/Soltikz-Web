import api from '@/utils/axios';

export const coverLetterApi = {
  streamGeneration: async (
    resumeId: string, 
    data: { jobDescription: string; companyName: string; position: string; tone: string; length: string },
    onChunk: (chunk: string) => void,
    onComplete: (data: any) => void,
    onError: (error: any) => void
  ) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/v1/cover-letter/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // assuming token is in localstorage
        },
        body: JSON.stringify({ resumeId, ...data })
      });

      if (!response.ok) {
        throw new Error('Stream request failed');
      }

      if (!response.body) throw new Error('ReadableStream not yet supported in this browser.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let done = false;
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const dataStr = line.replace('data: ', '');
                if (!dataStr) continue;
                const parsed = JSON.parse(dataStr);
                if (parsed.error) {
                  onError(new Error(parsed.error));
                  done = true;
                } else if (parsed.done) {
                  onComplete(parsed);
                } else if (parsed.text) {
                  onChunk(parsed.text);
                }
              } catch (e) {
                // Ignore incomplete JSON parses
              }
            }
          }
        }
      }
    } catch (error) {
      onError(error);
    }
  },

  save: async (data: any) => {
    const response = await api.post('/api/v1/cover-letter/save', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/api/v1/cover-letter/${id}`, data);
    return response.data;
  },

  exportFormat: async (id: string, format: string) => {
    const response = await api.post(`/api/v1/cover-letter/${id}/export`, { format }, { responseType: 'blob' });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/v1/cover-letter');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/api/v1/cover-letter/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/api/v1/cover-letter/${id}`);
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/api/v1/cover-letter/templates');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/api/v1/cover-letter/analytics');
    return response.data;
  }
};
