import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface AchievementGenerationOptions {
  achievementId: string;
  jobTitle?: string;
  company?: string;
  project?: string;
  responsibilities?: string;
  technologies?: string;
  targetRole?: string;
  writingStyle?: string;
  achievementCount?: string;
  additionalNotes?: string;
}

export const useGenerateAchievement = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; options: AchievementGenerationOptions }) => {
      const res = await api.post('/ai/achievement/generate', data);
      return res.data;
    },
  });
};

export const useAchievementHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'achievement', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/achievement/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
