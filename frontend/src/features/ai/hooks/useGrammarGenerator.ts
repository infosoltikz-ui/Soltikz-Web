import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface GrammarToneOptions {
  content: string;
  tone?: string;
  writingStyle?: string;
  englishVariant?: string;
  optimizationLevel?: string;
  preserveKeywords?: boolean;
  additionalInstructions?: string;
}

export const useOptimizeGrammar = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; options: GrammarToneOptions }) => {
      const res = await api.post('/ai/grammar/optimize', data);
      return res.data;
    },
  });
};

export const useGrammarHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'grammar', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/grammar/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
