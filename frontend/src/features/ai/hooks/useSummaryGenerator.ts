import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface SummaryGenerationOptions {
  targetJobTitle?: string;
  yearsOfExperience?: string;
  industry?: string;
  careerLevel?: string;
  writingStyle?: string;
  summaryLength?: string;
  additionalNotes?: string;
}

export const useGenerateSummary = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; options: SummaryGenerationOptions }) => {
      const res = await api.post('/ai/summary/generate', data);
      return res.data;
    },
  });
};

export const useSummaryHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'summary', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/summary/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
