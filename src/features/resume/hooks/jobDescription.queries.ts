import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axios';

export const jobDescriptionKeys = {
  all: ['jobDescription'] as const,
  analysis: (resumeId: string) => [...jobDescriptionKeys.all, resumeId, 'analysis'] as const,
};

export const useJobAnalysis = (resumeId: string) => {
  return useQuery({
    queryKey: jobDescriptionKeys.analysis(resumeId),
    queryFn: async () => {
      try {
        const { data } = await api.get(`/ai/job-description/analysis/${resumeId}`);
        return data;
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!resumeId,
  });
};

export const useAnalyzeJobDescription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      resumeId: string;
      jobDescription: string;
      sourceType: 'Paste' | 'PDF' | 'DOCX';
      fileName?: string;
    }) => {
      const { data } = await api.post('/ai/job-description/analyze', payload);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: jobDescriptionKeys.analysis(variables.resumeId),
      });
    },
  });
};
