import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeAward } from '../../services/resume.api';
import { useUpdateAward } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const schema = z.object({
  awardName: z.string().min(1, 'Award name is required').max(150),
  issuer: z.string().max(100).optional(),
  awardDate: z.string().max(50).optional(),
  description: z.string().max(4000).optional(),
});

type Values = z.infer<typeof schema>;

interface AwardFormProps {
  award: ResumeAward;
  resumeId: string;
}

export const AwardForm: React.FC<AwardFormProps> = ({ award, resumeId }) => {
  const { mutate: updateAward } = useUpdateAward();
  const { setSaveStatus, setLastSavedAt, liveAwards, setLiveAwards } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const { register, watch, formState: { errors } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      awardName: award.awardName || '',
      issuer: award.issuer || '',
      awardDate: award.awardDate || '',
      description: award.description || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    setLiveAwards(liveAwards.map(a => a.id === award.id ? { ...a, ...formValues } : a));
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    setSaveStatus('saving');
    updateAward({ id: resumeId, awardId: award.id, data: debouncedValues }, {
      onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
      onError: () => setSaveStatus('error'),
    });
  }, [debouncedValues]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateAward({ id: resumeId, awardId: award.id, data: formValues }, {
      onSuccess: () => { setSaveStatus('saved'); setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })); },
      onError: () => setSaveStatus('error'),
    });
  };

  return (
    <div className="space-y-4" onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) handleBlurSave(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Award Name *" placeholder="e.g. Best Innovation Award" error={errors.awardName?.message} {...register('awardName')} />
        <Input label="Issuing Organization" placeholder="e.g. Google" {...register('issuer')} />
      </div>
      <Input label="Date" placeholder="e.g. June 2023" {...register('awardDate')} />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Description</label>
        <textarea rows={3} placeholder="Describe what this award recognizes..." className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none bg-white text-sm resize-none" {...register('description')} />
      </div>
    </div>
  );
};
