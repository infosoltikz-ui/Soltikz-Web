import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface ExperienceBulletOptions {
  expId: string;
  jobTitle?: string;
  company?: string;
  experienceLevel?: string;
  responsibilities?: string;
  technologies?: string;
  targetRole?: string;
  writingStyle?: string;
  bulletCount?: string;
  additionalNotes?: string;
}

export const useGenerateExperienceBullets = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; options: ExperienceBulletOptions }) => {
      const res = await api.post('/ai/experience-bullets/generate', data);
      return res.data;
    },
  });
};

export const useExperienceBulletHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'experience-bullets', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/experience-bullets/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
