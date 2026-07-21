import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ResumeSkill } from '../../services/resume.api';
import { useUpdateSkill } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { Input } from '@/components/ui/Input';
import { useDebounce } from '@/hooks';

const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100),
  proficiency: z.string().max(50).optional(),
  category: z.string().max(50).optional(),
});

type SkillValues = z.infer<typeof skillSchema>;

interface SkillFormProps {
  skill: ResumeSkill;
  resumeId: string;
}

export const SkillForm: React.FC<SkillFormProps> = ({ skill, resumeId }) => {
  const { mutate: updateSkill } = useUpdateSkill();
  const { setSaveStatus, setLastSavedAt, liveSkills, setLiveSkills } = useResumeBuilderStore();
  const isFirstRender = useRef(true);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill.name || '',
      proficiency: skill.proficiency || 'Beginner',
      category: skill.category || '',
    },
  });

  const formValues = watch();
  const debouncedValues = useDebounce(formValues, 5000);

  useEffect(() => {
    const newSkills = liveSkills.map((s) => 
      s.id === skill.id ? { ...s, ...formValues } : s
    );
    setLiveSkills(newSkills);
  }, [formValues]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSaveStatus('saving');
    updateSkill(
      { id: resumeId, skillId: skill.id, data: debouncedValues },
      {
        onSuccess: () => {
          setSaveStatus('saved');
          setLastSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        },
        onError: () => setSaveStatus('error')
      }
    );
  }, [debouncedValues, resumeId, skill.id, updateSkill, setSaveStatus, setLastSavedAt]);

  const handleBlurSave = () => {
    setSaveStatus('saving');
    updateSkill(
      { id: resumeId, skillId: skill.id, data: formValues },
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
          label="Skill"
          placeholder="e.g. React.js"
          error={errors.name?.message}
          {...register('name')}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">Proficiency</label>
          <select 
            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all outline-none bg-white text-sm"
            {...register('proficiency')}
          >
            <option value="Novice">Novice</option>
            <option value="Beginner">Beginner</option>
            <option value="Skillful">Skillful</option>
            <option value="Experienced">Experienced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>
      </div>
      
      <Input
        label="Category (Optional)"
        placeholder="e.g. Frontend Development"
        error={errors.category?.message}
        {...register('category')}
      />
    </div>
  );
};
