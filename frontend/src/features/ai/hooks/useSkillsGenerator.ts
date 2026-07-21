import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface SkillsGenerationOptions {
  targetJobTitle?: string;
  industry?: string;
  experienceLevel?: string;
  targetTechnologies?: string;
  skillCategory?: string;
  additionalNotes?: string;
}

export const useGenerateSkills = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; options: SkillsGenerationOptions }) => {
      const res = await api.post('/ai/skills/generate', data);
      return res.data;
    },
  });
};

export const useSkillsHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'skills', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/skills/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
