import React from 'react';
import { useForm } from 'react-hook-form';
import { useOptimizeGrammar } from '../../../hooks/useGrammarGenerator';
import { useAIStore } from '../../../store/useAIStore';
import { Loader2, Wand2 } from 'lucide-react';

interface GrammarOptimizerFormInputs {
  content: string;
  tone: string;
  writingStyle: string;
  englishVariant: string;
  optimizationLevel: string;
  preserveKeywords: boolean;
  additionalInstructions: string;
}

export const GrammarOptimizerForm: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { setGeneratedGrammar, setGrammarLoading, grammarTargetContent, grammarTargetType } = useAIStore();
  const { mutate: optimize, isPending } = useOptimizeGrammar();

  const { register, handleSubmit } = useForm<GrammarOptimizerFormInputs>({
    defaultValues: {
      content: grammarTargetContent || '',
      tone: 'Professional',
      writingStyle: 'Clear and Concise',
      englishVariant: 'US English',
      optimizationLevel: 'Moderate',
      preserveKeywords: true,
      additionalInstructions: ''
    }
  });

  const onSubmit = (data: GrammarOptimizerFormInputs) => {
    setGrammarLoading(true);
    setGeneratedGrammar('');
    
    optimize(
      { 
        resumeId, 
        options: data
      },
      {
        onSuccess: (res: any) => {
          setGeneratedGrammar(res.response);
          setGrammarLoading(false);
        },
        onError: () => {
          setGrammarLoading(false);
        }
      }
    );
  };

  const typeDisplay = grammarTargetType ? 
    grammarTargetType.charAt(0).toUpperCase() + grammarTargetType.slice(1) : 
    'Content';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="bg-slate-100 p-3 rounded-lg mb-4 border border-slate-200">
        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Target Section</h4>
        <p className="text-[10px] text-slate-500">Improving: <strong className="text-slate-700">{typeDisplay}</strong></p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Original Content</label>
        <textarea 
          {...register('content')} 
          rows={5}
          readOnly
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500 outline-none resize-none cursor-not-allowed"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Tone</label>
          <select {...register('tone')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Professional">Professional</option>
            <option value="ATS Optimized">ATS Optimized</option>
            <option value="Executive">Executive</option>
            <option value="Technical">Technical</option>
            <option value="Leadership">Leadership</option>
            <option value="Friendly">Friendly</option>
            <option value="Concise">Concise</option>
            <option value="Formal">Formal</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Optimization Level</label>
          <select {...register('optimizationLevel')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="Light">Light (Fix errors only)</option>
            <option value="Moderate">Moderate (Improve flow)</option>
            <option value="Aggressive">Aggressive (Rewrite completely)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">English Variant</label>
          <select {...register('englishVariant')} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none">
            <option value="US English">US English</option>
            <option value="UK English">UK English</option>
            <option value="Australian English">Australian English</option>
            <option value="Canadian English">Canadian English</option>
          </select>
        </div>
        <div className="flex items-center mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              {...register('preserveKeywords')} 
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
            />
            <span className="text-xs font-medium text-slate-700">Preserve ATS Keywords</span>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1">Additional Instructions (Optional)</label>
        <textarea 
          {...register('additionalInstructions')} 
          placeholder="e.g. Make it sound more metrics-driven..."
          rows={2}
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none resize-none"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending || !grammarTargetContent}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-xl transition-all disabled:opacity-70"
        >
          {isPending ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</>
          ) : (
            <><Wand2 className="w-4 h-4" /> Improve with AI</>
          )}
        </button>
      </div>
    </form>
  );
};
