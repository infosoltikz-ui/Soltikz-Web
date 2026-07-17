import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { aiApi } from '../services/ai.api';

export const useProviderHealth = () => {
  return useQuery({
    queryKey: ['ai', 'health'],
    queryFn: aiApi.getHealth,
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useAIAnalytics = () => {
  return useQuery({
    queryKey: ['ai', 'analytics'],
    queryFn: aiApi.getAnalytics,
  });
};

export const usePromptRegistry = () => {
  return useQuery({
    queryKey: ['ai', 'prompts'],
    queryFn: aiApi.getPrompts,
  });
};

export const useClearCache = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: aiApi.clearCache,
    onSuccess: () => {
      // Could invalidate other queries here if cache status was shown
      queryClient.invalidateQueries({ queryKey: ['ai'] });
    },
  });
};
