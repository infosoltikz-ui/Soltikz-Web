import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeProject } from '../../services/resume.api';
import { useUpdateProject } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';
import { RichTextEditor } from '../RichTextEditor';
import { useAIStore } from '../../../ai/store/useAIStore';
import { Sparkles } from 'lucide-react';

const projectSchema = z.object({
  title: z.string().min(1, 'Project title is required').max(100),
  startDate: z.string().max(50).optional(),
  endDate: z.string().max(50).optional(),
  githubUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  liveUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().max(4000).optional(),
});

type ProjectValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  project: ResumeProject;
  resumeId: string;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ project, resumeId }) => {
  const { mutate: updateProject } = useUpdateProject();
  const { setSaveStatus, setLastSavedAt, liveProjects, setLiveProjects } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      description: project.description || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    const newProjects = liveProjects.map((proj) => 
      proj.id === project.id ? { ...proj, ...formValues } : proj
    );
    setLiveProjects(newProjects);
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    updateProject(
      { id: resumeId, projectId: project.id, data: debouncedValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => setSaveStatus('error')
      }
    );
  }, [debouncedValues, resumeId, project.id, updateProject, setSaveStatus, setLastSavedAt]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateProject(
      { id: resumeId, projectId: project.id, data: formValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => setSaveStatus('error')
      }
    );
  };

  return (
    <div className="space-y-4" onBlurCapture={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        handleBlurSave();
      }
    }}>
      <Input
        label="Project Title"
        placeholder="e.g. E-Commerce Platform"
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          placeholder="e.g. Jan 2021"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <Input
          label="End Date"
          placeholder="e.g. Present"
          error={errors.endDate?.message}
          {...register('endDate')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="GitHub / Source Code URL"
          placeholder="https://github.com/yourusername/project"
          error={errors.githubUrl?.message}
          {...register('githubUrl')}
        />
        <Input
          label="Live App URL"
          placeholder="https://myproject.com"
          error={errors.liveUrl?.message}
          {...register('liveUrl')}
        />
      </div>

      <div className="flex items-center justify-between mb-1">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              useAIStore.getState().setGeneratorSelectedId(project.id);
              useAIStore.getState().setGrammarTargetType('project');
              useAIStore.getState().setGrammarTargetContent(project.description || '');
              useAIStore.getState().setGeneratorType('grammar');
              useAIStore.getState().setGeneratorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            ✨ Improve with AI
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              useAIStore.getState().setGeneratorType('project');
              useAIStore.getState().setGeneratorSelectedId(project.id);
              useAIStore.getState().setGeneratorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            ✨ Generate Description
          </button>
        </div>
      </div>
      <div>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Describe what you built and the impact it had..."
              maxLength={4000}
              error={error?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
