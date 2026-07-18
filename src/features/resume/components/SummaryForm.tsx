import React, { useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Resume } from '../services/resume.api';
import { useUpdateSummary } from '../hooks/resume.queries';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { useDebounce } from '@/hooks';
import { RichTextEditor } from './RichTextEditor';
import { useAIStore } from '../../ai/store/useAIStore';

const summarySchema = z.object({
  content: z.string().max(2000, 'Max 2000 characters').optional(),
});

type SummaryValues = z.infer<typeof summarySchema>;

interface SummaryFormProps {
  resume: Resume;
}

export const SummaryForm: React.FC<SummaryFormProps> = ({ resume }) => {
  const { mutate: updateSummary } = useUpdateSummary();
  const { setSaveStatus, setLastSavedAt, setLiveSummary } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    control,
    watch,
  } = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      content: resume.summary?.content || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  // Instantly update live store for preview
  useEffect(() => {
    setLiveSummary(formValues as any);
  }, [formValues, setLiveSummary]);

  // Auto-save logic
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
        },
        onError: () => {
          setSaveStatus('error');
        }
      }
    );
  }, [debouncedValues, resume.id, updateSummary, setSaveStatus, setLastSavedAt]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateSummary(
      { id: resume.id, data: formValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => {
          setSaveStatus('error');
        }
      }
    );
  };

  return (
    <div className="space-y-4 pb-20" onBlurCapture={(e) => {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        handleBlurSave();
      }
    }}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          Write a brief summary highlighting your most valuable skills and experiences.
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              useAIStore.getState().setGeneratorType('grammar');
              useAIStore.getState().setGrammarTargetType('summary');
              useAIStore.getState().setGrammarTargetContent(resume.summary?.content || '');
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
              useAIStore.getState().setSummaryGeneratorOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200"
          >
            ✨ Generate With AI
          </button>
        </div>
      </div>
      
      <Controller
        control={control}
        name="content"
        render={({ field, fieldState: { error } }) => (
          <RichTextEditor
            value={field.value || ''}
            onChange={field.onChange}
            placeholder="e.g. Results-driven marketing professional with 5+ years of experience..."
            maxLength={2000}
            error={error?.message}
          />
        )}
      />
    </div>
  );
};
