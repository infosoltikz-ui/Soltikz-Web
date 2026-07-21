import React from 'react';
import { useForm } from 'react-hook-form';
import { useGenerateAchievement } from '../../../hooks/useAchievementGenerator';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { Loader2, Zap } from 'lucide-react';

interface AchievementFormInputs {
  jobTitle: string;
  company: string;
  project: string;
  responsibilities: string;
  technologies: string;
  targetRole: string;
  writingStyle: string;
  achievementCount: string;
  additionalNotes: string;
}

export const AchievementGeneratorForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { setGeneratedAchievement, setAchievementLoading, generatorSelectedId } = useAIStore();
  const { mutate: generate, isPending } = useGenerateAchievement();
  const { data: resume } = useResume(resumeId);

  const achievement = resume?.achievements?.find(a => a.id === generatorSelectedId);

  const { register, handleSubmit } = useForm<AchievementFormInputs>({
    defaultValues: {
      jobTitle: '',
      company: '',
      project: '',
      responsibilities: '',
      technologies: '',
      targetRole: '',
      writingStyle: 'Professional',
      achievementCount: '3',
      additionalNotes: ''
    }
  });

  const onSubmit = (data: AchievementFormInputs) => {
    if (!generatorSelectedId) return;

    setAchievementLoading(true);
    setGeneratedAchievement('');
    
    generate(
      { 
        resumeId, 
        options: {
          achievementId: generatorSelectedId,
          ...data
        }
      },
      {
        onSuccess: (res: any) => {
          setGeneratedAchievement(res.response);
          setAchievementLoading(false);
        },
        onError: () => {
          setAchievementLoading(false);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div className="bg-slate-100 p-3 rounded-lg mb-4 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Achievement Context</h4>
        <p className="text-[10px] text-slate-500">Generating for: <strong className="text-slate-700">{achievement?.title || 'Unknown Achievement'}</strong></p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
          <input 
            {...register('jobTitle')} 
            placeholder="e.g. Software Engineer"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
          <input 
            {...register('company')} 
            placeholder="e.g. Google"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Project (Optional)</label>
        <input 
          {...register('project')} 
          placeholder="e.g. Cloud Migration"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Raw Responsibilities</label>
        <textarea 
          {...register('responsibilities')} 
          placeholder="e.g. Maintained servers, improved speed, managed a team of 3..."
          rows={2}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Technologies Used</label>
        <input 
          {...register('technologies')} 
          placeholder="e.g. React, Node.js, AWS"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Role</label>
        <input 
          {...register('targetRole')} 
          placeholder="e.g. Senior Full Stack Developer"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Style</label>
          <select {...register('writingStyle')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="ATS Optimized">ATS Optimized</option>
            <option value="Professional">Professional</option>
            <option value="Executive">Executive</option>
            <option value="Technical">Technical</option>
            <option value="Leadership">Leadership</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Bullet Count</label>
          <select {...register('achievementCount')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="1">1 statement</option>
            <option value="3">3 statements</option>
            <option value="5">5 statements</option>
          </select>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending || !generatorSelectedId}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-70"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Zap className="w-4 h-4" /> Generate Achievement</>
          )}
        </button>
      </div>
    </form>
  );
};
