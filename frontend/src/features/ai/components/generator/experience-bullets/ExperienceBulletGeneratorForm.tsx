import React from 'react';
import { useForm } from 'react-hook-form';
import { useGenerateExperienceBullets } from '../../../hooks/useExperienceBulletGenerator';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { Loader2, Zap } from 'lucide-react';

interface ExperienceBulletFormInputs {
  jobTitle: string;
  company: string;
  experienceLevel: string;
  responsibilities: string;
  technologies: string;
  targetRole: string;
  writingStyle: string;
  bulletCount: string;
  additionalNotes: string;
}

export const ExperienceBulletGeneratorForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { setGeneratedExperienceBullets, setExperienceBulletsLoading, generatorSelectedId } = useAIStore();
  const { mutate: generate, isPending } = useGenerateExperienceBullets();
  const { data: resume } = useResume(resumeId);

  const experience = resume?.experiences?.find(e => e.id === generatorSelectedId);

  const { register, handleSubmit } = useForm<ExperienceBulletFormInputs>({
    defaultValues: {
      jobTitle: experience?.jobTitle || '',
      company: experience?.companyName || '',
      experienceLevel: 'Mid-Level',
      responsibilities: '',
      technologies: '',
      targetRole: '',
      writingStyle: 'ATS Optimized',
      bulletCount: '5',
      additionalNotes: ''
    }
  });

  const onSubmit = (data: ExperienceBulletFormInputs) => {
    if (!generatorSelectedId) return;

    setExperienceBulletsLoading(true);
    setGeneratedExperienceBullets('');
    
    generate(
      { 
        resumeId, 
        options: {
          expId: generatorSelectedId,
          ...data
        }
      },
      {
        onSuccess: (res: any) => {
          setGeneratedExperienceBullets(res.response);
          setExperienceBulletsLoading(false);
        },
        onError: () => {
          setExperienceBulletsLoading(false);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div className="bg-slate-100 p-3 rounded-lg mb-4 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Experience Context</h4>
        <p className="text-[10px] text-slate-500">Generating for: <strong className="text-slate-700">{experience?.jobTitle} at {experience?.companyName}</strong></p>
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
          <select {...register('experienceLevel')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Entry-Level">Entry-Level</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Lead/Manager">Lead/Manager</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Target Role</label>
          <input 
            {...register('targetRole')} 
            placeholder="e.g. Lead Engineer"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Raw Responsibilities</label>
        <textarea 
          {...register('responsibilities')} 
          placeholder="e.g. Built a new API, managed database migrations..."
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

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Style</label>
          <select {...register('writingStyle')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="ATS Optimized">ATS Optimized</option>
            <option value="Professional">Professional</option>
            <option value="Technical">Technical</option>
            <option value="Executive">Executive</option>
            <option value="Leadership">Leadership</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Bullet Count</label>
          <select {...register('bulletCount')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="3">3 bullets</option>
            <option value="5">5 bullets</option>
            <option value="7">7 bullets</option>
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
            <><Zap className="w-4 h-4" /> Generate Bullets</>
          )}
        </button>
      </div>
    </form>
  );
};
