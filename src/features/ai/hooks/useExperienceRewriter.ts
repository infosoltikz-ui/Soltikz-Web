import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface ExperienceRewriteOptions {
  targetJobTitle?: string;
  writingStyle?: string;
  tone?: string;
  bulletCount?: string;
  additionalNotes?: string;
}

export const useRewriteExperience = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; experienceId: string; options: ExperienceRewriteOptions }) => {
      const res = await api.post('/ai/experience/rewrite', data);
      return res.data;
    },
  });
};

export const useExperienceHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'experience', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/experience/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
