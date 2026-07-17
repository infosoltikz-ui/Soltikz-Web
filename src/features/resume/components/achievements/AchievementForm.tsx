import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeAchievement } from '../../services/resume.api';
import { useUpdateAchievement } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const schema = z.object({
  title: z.string().min(1, 'Title is required').max(150),
  description: z.string().max(4000).optional(),
  achievementDate: z.string().max(50).optional(),
});

type Values = z.infer<typeof schema>;

interface AchievementFormProps {
  achievement: ResumeAchievement;
  resumeId: string;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({ achievement, resumeId }) => {
  const { mutate: updateAchievement } = useUpdateAchievement();
  const { setSaveStatus, setLastSavedAt, liveAchievements, setLiveAchievements } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const { register, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: achievement.title || '',
      description: achievement.description || '',
      achievementDate: achievement.achievementDate || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    setLiveAchievements(liveAchievements.map(a => a.id === achievement.id ? { ...a, ...formValues } : a));
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('saving');
    updateAchievement(
      { id: resumeId, achievementId: achievement.id, data: debouncedValues },
      {
        onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
        onError: () => setSaveStatus('error'),
      }
    );
  }, [debouncedValues]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateAchievement(
      { id: resumeId, achievementId: achievement.id, data: formValues },
      {
        onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
        onError: () => setSaveStatus('error'),
      }
    );
  };

  return (
    <div className="space-y-4" onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) handleBlurSave(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Achievement Title *" placeholder="e.g. Employee of the Year" error={errors.title?.message} {...register('title')} />
        <Input label="Date" placeholder="e.g. Dec 2023" {...register('achievementDate')} />
      </div>
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea
          rows={3}
          placeholder="Briefly describe what you achieved and its impact..."
          className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none bg-white text-sm resize-none"
          {...register('description')}
        />
      </div>
    </div>
  );
};
