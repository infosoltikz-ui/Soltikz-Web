import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeEducation } from '../../services/resume.api';
import { useUpdateEducation } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';
import { RichTextEditor } from '../RichTextEditor';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(100),
  degree: z.string().max(100).optional(),
  fieldOfStudy: z.string().max(100).optional(),
  grade: z.string().max(50).optional(),
  startDate: z.string().max(50).optional(),
  endDate: z.string().max(50).optional(),
  city: z.string().max(50).optional(),
  country: z.string().max(50).optional(),
  description: z.string().max(4000).optional(),
  currentlyStudying: z.boolean().optional(),
});

type EducationValues = z.infer<typeof educationSchema>;

interface EducationFormProps {
  education: ResumeEducation;
  resumeId: string;
}

export const EducationForm: React.FC<EducationFormProps> = ({ education, resumeId }) => {
  const { mutate: updateEducation } = useUpdateEducation();
  const { setSaveStatus, setLastSavedAt, liveEducations, setLiveEducations } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useForm<EducationValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: education.institution || '',
      degree: education.degree || '',
      fieldOfStudy: education.fieldOfStudy || '',
      grade: education.grade || '',
      startDate: education.startDate || '',
      endDate: education.endDate || '',
      city: education.city || '',
      country: education.country || '',
      description: education.description || '',
      currentlyStudying: education.currentlyStudying || false,
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    const newEducations = liveEducations.map((edu) => 
      edu.id === education.id ? { ...edu, ...formValues } : edu
    );
    setLiveEducations(newEducations);
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    updateEducation(
      { id: resumeId, eduId: education.id, data: debouncedValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => setSaveStatus('error')
      }
    );
  }, [debouncedValues, resumeId, education.id, updateEducation, setSaveStatus, setLastSavedAt]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateEducation(
      { id: resumeId, eduId: education.id, data: formValues },
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
          label="School / Institution"
          placeholder="e.g. University of California"
          error={errors.institution?.message}
          {...register('institution')}
        />
        <Input
          label="Degree"
          placeholder="e.g. Bachelor of Science"
          error={errors.degree?.message}
          {...register('degree')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Field of Study"
          placeholder="e.g. Computer Science"
          error={errors.fieldOfStudy?.message}
          {...register('fieldOfStudy')}
        />
        <Input
          label="Grade / GPA"
          placeholder="e.g. 3.8/4.0"
          error={errors.grade?.message}
          {...register('grade')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Date"
          placeholder="e.g. Sep 2018"
          error={errors.startDate?.message}
          {...register('startDate')}
        />
        <div className="space-y-2">
          <Input
            label="End Date"
            placeholder="e.g. Jun 2022"
            disabled={formValues.currentlyStudying}
            error={errors.endDate?.message}
            {...register('endDate')}
          />
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded text-primary-600 focus:ring-primary-500" 
              {...register('currentlyStudying')} 
            />
            I currently study here
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          placeholder="e.g. Los Angeles"
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
        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
        <Controller
          control={control}
          name="description"
          render={({ field, fieldState: { error } }) => (
            <RichTextEditor
              value={field.value || ''}
              onChange={field.onChange}
              placeholder="Describe your relevant coursework and achievements..."
              maxLength={4000}
              error={error?.message}
            />
          )}
        />
      </div>
    </div>
  );
};
