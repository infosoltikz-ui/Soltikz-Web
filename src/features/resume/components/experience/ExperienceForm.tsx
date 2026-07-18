import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeExperience } from '../../services/resume.api';
import { useUpdateExperience } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';
import { RichTextEditor } from '../RichTextEditor';
import { useAIStore } from '../../../ai/store/useAIStore';

const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required').max(100),
  companyName: z.string().min(1, 'Company is required').max(100),
  startDate: z.string().max(50).optional(),
  endDate: z.string().max(50).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  description: z.string().max(4000).optional(),
  currentlyWorking: z.boolean().optional(),
});

type ExperienceValues = z.infer<typeof experienceSchema>;

interface ExperienceFormProps {
  experience: ResumeExperience;
  resumeId: string;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, resumeId }) => {
  const { mutate: updateExperience } = useUpdateExperience();
  const { setSaveStatus, setLastSavedAt, liveExperiences, setLiveExperiences } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<ExperienceValues>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      jobTitle: experience.jobTitle || '',
      companyName: experience.companyName || '',
      startDate: experience.startDate || '',
      endDate: experience.endDate || '',
      city: experience.city || '',
      country: experience.country || '',
      description: experience.description || '',
      currentlyWorking: experience.currentlyWorking || false,
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  // Instantly update live store for preview
  useEffect(() => {
    const newExperiences = liveExperiences.map((exp) => 
      exp.id === experience.id ? { ...exp, ...formValues } : exp
    );
    setLiveExperiences(newExperiences);
  }, [formValues]); // Intentionally omitting setLiveExperiences/liveExperiences to avoid circular dependency loop, this is handled via Zustand

  // Auto-save logic
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    updateExperience(
      { id: resumeId, expId: experience.id, data: debouncedValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => setSaveStatus('error')
      }
    );
  }, [debouncedValues, resumeId, experience.id, updateExperience, setSaveStatus, setLastSavedAt]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateExperience(
      { id: resumeId, expId: experience.id, data: formValues },
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Job Title"
          placeholder="e.g. Software Engineer"
          error={errors.jobTitle?.message}
          {...register('jobTitle')}
        />
        <Input
          label="Company / Employer"
          placeholder="e.g. Google"
          error={errors.companyName?.message}
          {...register('companyName')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          placeholder="e.g. Jan 2020"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <div className="space-y-2">
          <Input
            label="End Date"
            placeholder="e.g. Dec 2023"
            disabled={formValues.currentlyWorking}
            error={errors.endDate?.message}
            {...register('endDate')}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded text-primary-600 focus:ring-primary-500" 
              {...register('currentlyWorking')} 
            />
            I currently work here
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="e.g. San Francisco"
          error={errors.city?.message}
          {...register('city')}
        />
        <Input
          label="Country"
          placeholder="e.g. United States"
          error={errors.country?.message}
          {...register('country')}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                useAIStore.getState().setGeneratorSelectedId(experience.id);
                useAIStore.getState().setGeneratorType('experience-bullets');
                useAIStore.getState().setGeneratorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
            >
              ✨ Generate Bullet Points
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                useAIStore.getState().setGeneratorSelectedId(experience.id);
                useAIStore.getState().setGeneratorType('experience');
                useAIStore.getState().setGeneratorOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
            >
              ✨ Rewrite With AI
            </button>
          </div>
        </div>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Describe your achievements and responsibilities..."
              maxLength={4000}
              error={error?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
