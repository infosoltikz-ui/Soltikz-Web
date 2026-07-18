import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRewriteExperience } from '../../../hooks/useExperienceRewriter';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { Loader2, Zap } from 'lucide-react';

interface ExperienceFormInputs {
  targetJobTitle: string;
  writingStyle: string;
  tone: string;
  bulletCount: string;
  additionalNotes: string;
}

export const ExperienceRewriterForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { generatorSelectedId, setRewrittenExperience, setExperienceLoading } = useAIStore();
  const { data: resume } = useResume(resumeId);
  const { mutate: rewrite, isPending } = useRewriteExperience();

  const experience = resume?.experiences?.find(e => e.id === generatorSelectedId);

  const { register, handleSubmit, reset } = useForm<ExperienceFormInputs>({
    defaultValues: {
      targetJobTitle: '',
      writingStyle: 'Professional',
      tone: 'Achievement-focused',
      bulletCount: '3-5',
      additionalNotes: ''
    }
  });

  useEffect(() => {
    if (experience) {
      reset(formValues => ({
        ...formValues,
        targetJobTitle: formValues.targetJobTitle || experience.jobTitle || ''
      }));
    }
  }, [experience, reset]);

  const onSubmit = (data: ExperienceFormInputs) => {
    if (!generatorSelectedId) return;

    setExperienceLoading(true);
    setRewrittenExperience('');
    
    rewrite(
      { resumeId, experienceId: generatorSelectedId, options: data },
      {
        onSuccess: (res: any) => {
          setRewrittenExperience(res.response);
          setExperienceLoading(false);
        },
        onError: () => {
          setExperienceLoading(false);
        }
      }
    );
  };

  if (!experience) {
    return <div className="text-sm text-slate-500">Experience not found.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div className="bg-slate-100 p-3 rounded-lg mb-4 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Rewriting:</h4>
        <p className="text-sm font-medium text-slate-900">{experience.jobTitle}</p>
        <p className="text-xs text-slate-500">{experience.companyName}</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role (Optional)</label>
        <input 
          {...register('targetJobTitle')} 
          placeholder="e.g. Senior Software Engineer"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
        <p className="text-[10px] text-slate-400 mt-1">Leave blank to use current job title.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Style</label>
          <select {...register('writingStyle')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Professional">Professional</option>
            <option value="Technical">Technical</option>
            <option value="Executive">Executive</option>
            <option value="ATS Optimized">ATS Optimized</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Bullet Count</label>
          <select {...register('bulletCount')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="3-5">3 - 5 bullets</option>
            <option value="5-7">5 - 7 bullets</option>
            <option value="7+">7+ bullets (Detailed)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Tone</label>
        <select {...register('tone')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
          <option value="Achievement-focused">Achievement-focused</option>
          <option value="Leadership">Leadership</option>
          <option value="Action-oriented">Action-oriented</option>
          <option value="Concise">Concise</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Instructions</label>
        <textarea 
          {...register('additionalNotes')} 
          placeholder="e.g. Focus on my work with AWS and microservices..."
          rows={3}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-70"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Rewriting...</>
          ) : (
            <><Zap className="w-4 h-4" /> Rewrite Experience</>
          )}
        </button>
      </div>
    </form>
  );
};
