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
  updateTemplate,
  updateTheme,
  updateTypography,
  updateLayout,
  updatePersonalInfo,
  updateSummary,
  GetResumesParams,
  ResumePersonal,
  ResumeSummary,
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

// ==================== Sprint 3.5 Settings Hooks ====================

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { selectedTemplate: string } }) => updateTemplate(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => old ? { ...old, ...data } : old);
    },
    onError: (error: any) => useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to save template'),
  });
};

export const useUpdateTheme = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { defaultTheme?: string; primaryColor?: string } }) => updateTheme(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => old ? { ...old, ...data } : old);
    },
    onError: (error: any) => useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to save theme'),
  });
};

export const useUpdateTypography = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { fontFamily?: string; fontSize?: string; lineSpacing?: string } }) => updateTypography(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => old ? { ...old, ...data } : old);
    },
    onError: (error: any) => useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to save typography'),
  });
};

export const useUpdateLayout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { sectionSpacing?: string; pageMargin?: string; showProfilePhoto?: boolean; showIcons?: boolean; showSectionDividers?: boolean } }) => updateLayout(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => old ? { ...old, ...data } : old);
    },
    onError: (error: any) => useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to save layout'),
  });
};

export const useUpdatePersonal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResumePersonal }) => updatePersonalInfo(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, personal: data, updatedAt: new Date().toISOString() };
      });
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to save personal information');
    },
  });
};

export const useUpdateSummary = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResumeSummary }) => updateSummary(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, summary: data, updatedAt: new Date().toISOString() };
      });
    },
    onError: (error: any) => {
      useUIStore.getState().toast.error(error.response?.data?.message || 'Failed to save professional summary');
    },
  });
};

// ==========================================
// EXPERIENCE HOOKS
// ==========================================
import {
  createExperience, updateExperience, deleteExperience, reorderExperience,
  createEducation, updateEducation, deleteEducation, reorderEducation,
  createSkill, updateSkill, deleteSkill, reorderSkill,
  createProject, updateProject, deleteProject, reorderProject,
  ResumeExperience, ResumeEducation, ResumeSkill, ResumeProject, ReorderPayload
} from '../services/resume.api';

export const useCreateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeExperience> }) => createExperience(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, experiences: [...(old.experiences || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Experience added');
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, expId, data }: { id: string; expId: string; data: Partial<ResumeExperience> }) => updateExperience(id, expId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const experiences = old.experiences?.map((e: any) => e.id === data.id ? data : e) || [];
        return { ...old, experiences, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, expId }: { id: string; expId: string }) => deleteExperience(id, expId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const experiences = old.experiences?.filter((e: any) => e.id !== variables.expId) || [];
        return { ...old, experiences, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Experience deleted');
    },
  });
};

export const useReorderExperience = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderExperience(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// EDUCATION HOOKS
// ==========================================
export const useCreateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeEducation> }) => createEducation(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, educations: [...(old.educations || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Education added');
    },
  });
};

export const useUpdateEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, eduId, data }: { id: string; eduId: string; data: Partial<ResumeEducation> }) => updateEducation(id, eduId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const educations = old.educations?.map((e: any) => e.id === data.id ? data : e) || [];
        return { ...old, educations, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, eduId }: { id: string; eduId: string }) => deleteEducation(id, eduId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const educations = old.educations?.filter((e: any) => e.id !== variables.eduId) || [];
        return { ...old, educations, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Education deleted');
    },
  });
};

export const useReorderEducation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderEducation(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// SKILLS HOOKS
// ==========================================
export const useCreateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeSkill> }) => createSkill(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, skills: [...(old.skills || []), data], updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useUpdateSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, skillId, data }: { id: string; skillId: string; data: Partial<ResumeSkill> }) => updateSkill(id, skillId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const skills = old.skills?.map((e: any) => e.id === data.id ? data : e) || [];
        return { ...old, skills, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, skillId }: { id: string; skillId: string }) => deleteSkill(id, skillId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const skills = old.skills?.filter((e: any) => e.id !== variables.skillId) || [];
        return { ...old, skills, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useReorderSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderSkill(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// PROJECTS HOOKS
// ==========================================
export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeProject> }) => createProject(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, projects: [...(old.projects || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Project added');
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId, data }: { id: string; projectId: string; data: Partial<ResumeProject> }) => updateProject(id, projectId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const projects = old.projects?.map((e: any) => e.id === data.id ? data : e) || [];
        return { ...old, projects, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, projectId }: { id: string; projectId: string }) => deleteProject(id, projectId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const projects = old.projects?.filter((e: any) => e.id !== variables.projectId) || [];
        return { ...old, projects, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Project deleted');
    },
  });
};

export const useReorderProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// CERTIFICATIONS HOOKS
// ==========================================
import {
  createCertification, updateCertification, deleteCertification, reorderCertification,
  createLanguage, updateLanguage, deleteLanguage, reorderLanguage,
  createAchievement, updateAchievement, deleteAchievement, reorderAchievement,
  createAward, updateAward, deleteAward, reorderAward,
  createInterest, updateInterest, deleteInterest, reorderInterest,
  createReference, updateReference, deleteReference, reorderReference,
  ResumeCertification, ResumeLanguage, ResumeAchievement, ResumeAward, ResumeInterest, ResumeReference,
} from '../services/resume.api';

export const useCreateCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeCertification> }) => createCertification(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, certifications: [...(old.certifications || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Certification added');
    },
  });
};

export const useUpdateCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, certId, data }: { id: string; certId: string; data: Partial<ResumeCertification> }) => updateCertification(id, certId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const certifications = old.certifications?.map((c: any) => c.id === data.id ? data : c) || [];
        return { ...old, certifications, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, certId }: { id: string; certId: string }) => deleteCertification(id, certId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const certifications = old.certifications?.filter((c: any) => c.id !== variables.certId) || [];
        return { ...old, certifications, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Certification deleted');
    },
  });
};

export const useReorderCertification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderCertification(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// LANGUAGES HOOKS
// ==========================================
export const useCreateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeLanguage> }) => createLanguage(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, languages: [...(old.languages || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Language added');
    },
  });
};

export const useUpdateLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, langId, data }: { id: string; langId: string; data: Partial<ResumeLanguage> }) => updateLanguage(id, langId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const languages = old.languages?.map((l: any) => l.id === data.id ? data : l) || [];
        return { ...old, languages, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, langId }: { id: string; langId: string }) => deleteLanguage(id, langId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const languages = old.languages?.filter((l: any) => l.id !== variables.langId) || [];
        return { ...old, languages, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Language deleted');
    },
  });
};

export const useReorderLanguage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderLanguage(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// ACHIEVEMENTS HOOKS
// ==========================================
export const useCreateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeAchievement> }) => createAchievement(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, achievements: [...(old.achievements || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Achievement added');
    },
  });
};

export const useUpdateAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, achievementId, data }: { id: string; achievementId: string; data: Partial<ResumeAchievement> }) => updateAchievement(id, achievementId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const achievements = old.achievements?.map((a: any) => a.id === data.id ? data : a) || [];
        return { ...old, achievements, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, achievementId }: { id: string; achievementId: string }) => deleteAchievement(id, achievementId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const achievements = old.achievements?.filter((a: any) => a.id !== variables.achievementId) || [];
        return { ...old, achievements, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Achievement deleted');
    },
  });
};

export const useReorderAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderAchievement(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// AWARDS HOOKS
// ==========================================
export const useCreateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeAward> }) => createAward(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, awards: [...(old.awards || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Award added');
    },
  });
};

export const useUpdateAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, awardId, data }: { id: string; awardId: string; data: Partial<ResumeAward> }) => updateAward(id, awardId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const awards = old.awards?.map((a: any) => a.id === data.id ? data : a) || [];
        return { ...old, awards, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, awardId }: { id: string; awardId: string }) => deleteAward(id, awardId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const awards = old.awards?.filter((a: any) => a.id !== variables.awardId) || [];
        return { ...old, awards, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Award deleted');
    },
  });
};

export const useReorderAward = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderAward(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// INTERESTS HOOKS
// ==========================================
export const useCreateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeInterest> }) => createInterest(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, interests: [...(old.interests || []), data], updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useUpdateInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, interestId, data }: { id: string; interestId: string; data: Partial<ResumeInterest> }) => updateInterest(id, interestId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const interests = old.interests?.map((i: any) => i.id === data.id ? data : i) || [];
        return { ...old, interests, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, interestId }: { id: string; interestId: string }) => deleteInterest(id, interestId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const interests = old.interests?.filter((i: any) => i.id !== variables.interestId) || [];
        return { ...old, interests, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useReorderInterest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderInterest(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

// ==========================================
// REFERENCES HOOKS
// ==========================================
export const useCreateReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ResumeReference> }) => createReference(id, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        return { ...old, references: [...(old.references || []), data], updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Reference added');
    },
  });
};

export const useUpdateReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, refId, data }: { id: string; refId: string; data: Partial<ResumeReference> }) => updateReference(id, refId, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const references = old.references?.map((r: any) => r.id === data.id ? data : r) || [];
        return { ...old, references, updatedAt: new Date().toISOString() };
      });
    },
  });
};

export const useDeleteReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, refId }: { id: string; refId: string }) => deleteReference(id, refId),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(resumeKeys.detail(variables.id), (old: any) => {
        if (!old) return old;
        const references = old.references?.filter((r: any) => r.id !== variables.refId) || [];
        return { ...old, references, updatedAt: new Date().toISOString() };
      });
      useUIStore.getState().toast.success('Reference deleted');
    },
  });
};

export const useReorderReference = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ReorderPayload }) => reorderReference(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: resumeKeys.detail(variables.id) });
    },
  });
};

