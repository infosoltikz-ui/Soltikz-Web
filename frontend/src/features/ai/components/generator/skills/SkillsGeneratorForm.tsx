import React from 'react';
import { useForm } from 'react-hook-form';
import { useGenerateSkills } from '../../../hooks/useSkillsGenerator';
import { useAIStore } from '../../../store/useAIStore';
import { Loader2, Zap } from 'lucide-react';

interface SkillsFormInputs {
  targetJobTitle: string;
  industry: string;
  experienceLevel: string;
  targetTechnologies: string;
  skillCategory: string;
  additionalNotes: string;
}

export const SkillsGeneratorForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { setGeneratedSkills, setSkillsLoading } = useAIStore();
  const { mutate: generate, isPending } = useGenerateSkills();

  const { register, handleSubmit } = useForm<SkillsFormInputs>({
    defaultValues: {
      targetJobTitle: '',
      industry: '',
      experienceLevel: 'Mid Level',
      targetTechnologies: '',
      skillCategory: 'All',
      additionalNotes: ''
    }
  });

  const onSubmit = (data: SkillsFormInputs) => {
    setSkillsLoading(true);
    setGeneratedSkills('');
    
    generate(
      { resumeId, options: data },
      {
        onSuccess: (res: any) => {
          setGeneratedSkills(res.response);
          setSkillsLoading(false);
        },
        onError: () => {
          setSkillsLoading(false);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div className="bg-slate-100 p-3 rounded-lg mb-4 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Generating Skills</h4>
        <p className="text-[10px] text-slate-500">We'll analyze your resume to suggest ATS-friendly skills.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
        <input 
          {...register('targetJobTitle')} 
          placeholder="e.g. Senior Frontend Engineer"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Experience Level</label>
          <select {...register('experienceLevel')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Executive">Executive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
          <input 
            {...register('industry')} 
            placeholder="e.g. Fintech"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Skill Category to Focus On</label>
        <select {...register('skillCategory')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
          <option value="All">All Categories</option>
          <option value="Programming Languages">Programming Languages</option>
          <option value="Frameworks & Libraries">Frameworks & Libraries</option>
          <option value="Databases & Cloud">Databases & Cloud</option>
          <option value="DevOps & Tools">DevOps & Tools</option>
          <option value="Soft Skills">Soft Skills</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Technologies (Optional)</label>
        <input 
          {...register('targetTechnologies')} 
          placeholder="e.g. React, Node.js, AWS"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Instructions</label>
        <textarea 
          {...register('additionalNotes')} 
          placeholder="e.g. Include skills relevant to microservices architecture..."
          rows={2}
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
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Zap className="w-4 h-4" /> Generate Skills</>
          )}
        </button>
      </div>
    </form>
  );
};
