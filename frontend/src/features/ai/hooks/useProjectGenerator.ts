import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/utils/axios';

export interface ProjectGenerationOptions {
  projectId: string;
  role?: string;
  features?: string;
  targetJobRole?: string;
  writingStyle?: string;
  descriptionLength?: string;
  additionalNotes?: string;
}

export const useGenerateProject = () => {
  return useMutation({
    mutationFn: async (data: { resumeId: string; options: ProjectGenerationOptions }) => {
      const res = await api.post('/ai/project/generate', data);
      return res.data;
    },
  });
};

export const useProjectHistory = (resumeId: string) => {
  return useQuery({
    queryKey: ['ai', 'project', 'history', resumeId],
    queryFn: async () => {
      const res = await api.get(`/ai/project/history?resumeId=${resumeId}`);
      return res.data;
    },
    enabled: !!resumeId,
  });
};
