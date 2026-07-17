import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi, AISettings, GenerateAIRequest } from '../services/ai.api';

export const useAISettings = () => {
  return useQuery({
    queryKey: ['ai-settings'],
    queryFn: aiApi.getSettings,
  });
};

export const useUpdateAISettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiApi.updateSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(['ai-settings'], data);
    },
  });
};

export const useAIHistory = () => {
  return useQuery({
    queryKey: ['ai-history'],
    queryFn: aiApi.getHistory,
  });
};

export const useGenerateAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: aiApi.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai-history'] });
    },
  });
};
