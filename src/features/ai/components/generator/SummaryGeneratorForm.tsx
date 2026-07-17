import React from 'react';
import { useForm } from 'react-hook-form';
import { useGenerateSummary } from '../../hooks/useSummaryGenerator';
import { useAIStore } from '../../store/useAIStore';
import { Loader2, Zap } from 'lucide-react';

interface SummaryFormInputs {
  targetJobTitle: string;
  yearsOfExperience: string;
  industry: string;
  careerLevel: string;
  writingStyle: string;
  summaryLength: string;
  additionalNotes: string;
}

export const SummaryGeneratorForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { mutate: generate, isPending } = useGenerateSummary();
  const { setGeneratedSummary, setSummaryLoading } = useAIStore();

  const { register, handleSubmit } = useForm<SummaryFormInputs>({
    defaultValues: {
      targetJobTitle: '',
      yearsOfExperience: '5',
      industry: '',
      careerLevel: 'Professional',
      writingStyle: 'Professional',
      summaryLength: 'Medium',
      additionalNotes: ''
    }
  });

  const onSubmit = (data: SummaryFormInputs) => {
    setSummaryLoading(true);
    setGeneratedSummary('');
    
    generate(
      { resumeId, options: data },
      {
        onSuccess: (res) => {
          setGeneratedSummary(res.response);
          setSummaryLoading(false);
        },
        onError: () => {
          setSummaryLoading(false);
        }
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Target Job Title</label>
        <input 
          {...register('targetJobTitle')} 
          placeholder="e.g. Senior Product Manager"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Years of Exp</label>
          <select {...register('yearsOfExperience')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Career Level</label>
          <select {...register('careerLevel')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Entry Level">Entry Level</option>
            <option value="Professional">Professional</option>
            <option value="Executive">Executive</option>
            <option value="Manager">Manager</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Industry</label>
        <input 
          {...register('industry')} 
          placeholder="e.g. Technology, Healthcare"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Writing Style</label>
          <select {...register('writingStyle')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Professional">Professional</option>
            <option value="Technical">Technical</option>
            <option value="Creative">Creative</option>
            <option value="ATS Optimized">ATS Optimized</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Length</label>
          <select {...register('summaryLength')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Short">Short (~50 words)</option>
            <option value="Medium">Medium (~100 words)</option>
            <option value="Long">Long (~150 words)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Instructions</label>
        <textarea 
          {...register('additionalNotes')} 
          placeholder="e.g. Focus heavily on my leadership skills..."
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
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
          ) : (
            <><Zap className="w-4 h-4" /> Generate AI Summary</>
          )}
        </button>
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-2">
        Context (Experience, Education, Skills) is automatically extracted from your resume.
      </p>

    </form>
  );
};
