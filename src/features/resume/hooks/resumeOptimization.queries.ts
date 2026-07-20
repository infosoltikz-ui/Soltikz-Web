import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/axios';

export const optimizationKeys = {
  all: ['resumeOptimization'] as const,
  history: (resumeId: string) => [...optimizationKeys.all, 'history', resumeId] as const,
};

interface GenerateOptimizationPayload {
  resumeId: string;
  targetSection?: string;
  conversationId?: string;
}

export const useGenerateOptimization = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: GenerateOptimizationPayload) => {
      const response = await api.post('/ai/resume-optimization/generate', payload);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: optimizationKeys.history(variables.resumeId) });
    },
  });
};

export const useOptimizationHistory = (resumeId: string) => {
  return useQuery({
    queryKey: optimizationKeys.history(resumeId),
    queryFn: async () => {
      if (!resumeId) return null;
      const response = await api.get(`/ai/resume-optimization/${resumeId}/history`);
      return response.data;
    },
    enabled: !!resumeId,
  });
};
