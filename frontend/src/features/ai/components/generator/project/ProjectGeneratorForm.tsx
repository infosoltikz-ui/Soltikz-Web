import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGenerateProject } from '../../../hooks/useProjectGenerator';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { Loader2, Zap } from 'lucide-react';

interface ProjectFormInputs {
  role: string;
  features: string;
  targetJobRole: string;
  writingStyle: string;
  descriptionLength: string;
  additionalNotes: string;
}

export const ProjectGeneratorForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { setGeneratedProject, setProjectLoading, generatorSelectedId } = useAIStore();
  const { mutate: generate, isPending } = useGenerateProject();
  const { data: resume } = useResume(resumeId);

  const project = resume?.projects?.find(p => p.id === generatorSelectedId);

  const { register, handleSubmit } = useForm<ProjectFormInputs>({
    defaultValues: {
      role: '',
      features: '',
      targetJobRole: '',
      writingStyle: 'Professional',
      descriptionLength: 'Medium',
      additionalNotes: ''
    }
  });

  const onSubmit = (data: ProjectFormInputs) => {
    if (!generatorSelectedId) return;

    setProjectLoading(true);
    setGeneratedProject('');
    
    generate(
      { 
        resumeId, 
        options: {
          projectId: generatorSelectedId,
          ...data
        }
      },
      {
        onSuccess: (res: any) => {
          setGeneratedProject(res.response);
          setProjectLoading(false);
        },
        onError: () => {
          setProjectLoading(false);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div className="bg-slate-100 p-3 rounded-lg mb-4 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Project Context</h4>
        <p className="text-[10px] text-slate-500">Generating for: <strong className="text-slate-700">{project?.title || 'Unknown Project'}</strong></p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Your Role in the Project</label>
        <input 
          {...register('role')} 
          placeholder="e.g. Lead Developer, UI Designer"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Key Features Developed</label>
        <input 
          {...register('features')} 
          placeholder="e.g. User Authentication, Payment Gateway"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Role</label>
        <input 
          {...register('targetJobRole')} 
          placeholder="e.g. Full Stack Developer"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Style</label>
          <select {...register('writingStyle')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Professional">Professional</option>
            <option value="Technical">Technical</option>
            <option value="Impact-Driven">Impact-Driven</option>
            <option value="Concise">Concise</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Length</label>
          <select {...register('descriptionLength')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Short">Short (~2 bullets)</option>
            <option value="Medium">Medium (~4 bullets)</option>
            <option value="Detailed">Detailed (~6 bullets)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Notes</label>
        <textarea 
          {...register('additionalNotes')} 
          placeholder="e.g. Focus heavily on backend architecture and AWS usage."
          rows={2}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none resize-none"
        />
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
            <><Zap className="w-4 h-4" /> Generate Description</>
          )}
        </button>
      </div>
    </form>
  );
};
