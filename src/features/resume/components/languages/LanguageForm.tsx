import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeLanguage } from '../../services/resume.api';
import { useUpdateLanguage } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Beginner'] as const;

const PROFICIENCY_COLORS: Record<string, string> = {
  Native: 'bg-violet-100 text-violet-700',
  Fluent: 'bg-emerald-100 text-emerald-700',
  Advanced: 'bg-blue-100 text-blue-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Beginner: 'bg-slate-100 text-slate-600',
};

const langSchema = z.object({
  language: z.string().min(1, 'Language is required').max(100),
  proficiency: z.enum(PROFICIENCY_LEVELS),
});

type LangValues = z.infer<typeof langSchema>;

interface LanguageFormProps {
  language: ResumeLanguage;
  resumeId: string;
}

export const LanguageForm: React.FC<LanguageFormProps> = ({ language, resumeId }) => {
  const { mutate: updateLanguage } = useUpdateLanguage();
  const { setSaveStatus, setLastSavedAt, liveLanguages, setLiveLanguages } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const { register, watch, formState: { errors } } = useForm<LangValues>({
    resolver: zodResolver(langSchema),
    defaultValues: {
      language: language.language || '',
      proficiency: (language.proficiency as any) || 'Intermediate',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    const updated = liveLanguages.map(l =>
      l.id === language.id ? { ...l, ...formValues } : l
    );
    setLiveLanguages(updated);
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('saving');
    updateLanguage(
      { id: resumeId, langId: language.id, data: debouncedValues },
      {
        onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
        onError: () => setSaveStatus('error'),
      }
    );
  }, [debouncedValues]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateLanguage(
      { id: resumeId, langId: language.id, data: formValues },
      {
        onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
        onError: () => setSaveStatus('error'),
      }
    );
  };

  return (
    <div className="space-y-4" onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) handleBlurSave(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Language *"
          placeholder="e.g. English"
          error={errors.language?.message}
          {...register('language')}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Proficiency</label>
          <select
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none bg-white text-sm"
            {...register('proficiency')}
          >
            {PROFICIENCY_LEVELS.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
          {formValues.proficiency && (
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${PROFICIENCY_COLORS[formValues.proficiency] || ''}`}>
              {formValues.proficiency}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
