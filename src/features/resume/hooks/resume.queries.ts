import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
  archiveResume,
  restoreResume,
  toggleFavoriteResume,
  GetResumesParams,
} from '../services/resume.api';
import { useUIStore } from '@store/useUIStore';

export const resumeKeys = {
  all: ['resumes'] as const,
  lists: () => [...resumeKeys.all, 'list'] as const,
  list: (params: GetResumesParams) => [...resumeKeys.lists(), params] as const,
  details: () => [...resumeKeys.all, 'detail'] as const,
  detail: (id: string) => [...resumeKeys.details(), id] as const,
};

export const useResumes = (params: GetResumesParams) => {
  return useQuery({
    queryKey: resumeKeys.list(params),
    queryFn: () => getResumes(params),
    placeholderData: (previousData) => previousData,
  });
};

export const useResume = (id: string) => {
  return useQuery({
    queryKey: resumeKeys.detail(id),
    queryFn: () => getResumeById(id),
    enabled: !!id,
  });
};

export const useCreateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      useUIStore.getState().toast.success('Resume created successfully');
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to create resume');
    },
  });
};

export const useUpdateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { title?: string; status?: string; visibility?: string } }) =>
      updateResume(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      queryClient.setQueryData(resumeKeys.detail(data.id), data);
      useUIStore.getState().toast.success('Resume updated successfully');
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to update resume');
    },
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      useUIStore.getState().toast.success('Resume deleted successfully');
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to delete resume');
    },
  });
};

export const useDuplicateResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: duplicateResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      useUIStore.getState().toast.success('Resume duplicated successfully');
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to duplicate resume');
    },
  });
};

export const useArchiveResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      useUIStore.getState().toast.success('Resume status updated');
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to update resume status');
    },
  });
};

export const useRestoreResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
      useUIStore.getState().toast.success('Resume restored successfully');
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to restore resume');
    },
  });
};

export const useToggleFavoriteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleFavoriteResume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.lists() });
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to update favorites status');
    },
  });
};
