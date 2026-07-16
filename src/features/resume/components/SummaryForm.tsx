import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Resume } from '../services/resume.api';
import { useUpdateSummary } from '../hooks/resume.queries';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { useDebounce } from '@/hooks';

const summarySchema = z.object({
  content: z.string().max(2000, 'Max 2000 characters').optional(),
});

type SummaryValues = z.infer<typeof summarySchema>;

interface SummaryFormProps {
  resume: Resume;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ resume }) => {
  const { mutate: updateSummary } = useUpdateSummary();
  const { setSaveStatus, setLastSavedAt } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      content: resume.summary?.content || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 1000);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    updateSummary(
      { id: resume.id, data: debouncedValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          setTimeout(() => {
            if (useResumeBuilderStore.getState().saveStatus === 'saved') {
              setSaveStatus('idle');
            }
          }, 2000);
        },
        onError: () => {
          setSaveStatus('error');
        }
      }
    );
  }, [debouncedValues, resume.id, updateSummary, setSaveStatus, setLastSavedAt]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">
        Write a brief summary highlighting your most valuable skills and experiences.
      </p>
      
      <div>
        <textarea
          className={`w-full min-h-[200px] p-3 rounded-xl border ${
            errors.content ? 'border-rose-300 focus:ring-rose-200' : 'border-slate-200 focus:ring-primary-100'
          } focus:border-primary-500 focus:ring-4 outline-none transition-all resize-y text-slate-700 leading-relaxed`}
          placeholder="e.g. Results-driven marketing professional with 5+ years of experience..."
          {...register('content')}
        />
        {errors.content && (
          <p className="mt-1.5 text-sm text-rose-500">{errors.content.message}</p>
        )}
      </div>
    </div>
  );
};
