import React, { useState } from 'react';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { useCreateSkill } from '../../../../resume/hooks/resume.queries';
import { Check, X, Copy } from 'lucide-react';
import { RichTextEditor } from '../../../../resume/components/RichTextEditor';

export const SkillsPreview: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { generatedSkills, setGeneratedSkills, skillsLoading, setGeneratorOpen } = useAIStore();
  const { data: resume } = useResume(resumeId);
  const { mutate: createSkill } = useCreateSkill();
  const [isUpdating, setIsUpdating] = useState(false);

  const existingSkills = resume?.skills?.map(s => s.name.toLowerCase().trim()) || [];

  const handleAccept = async () => {
    if (!generatedSkills) return;
    
    setIsUpdating(true);
    
    // Simple parsing logic: split by newlines or commas, filter out long sentences, headers, or existing skills
    const lines = generatedSkills.split(/[\n,]/).map(s => s.trim().replace(/^[-*•]\s*/, ''));
    const parsedSkills = lines.filter(s => 
      s.length > 0 && 
      s.length < 50 && 
      !s.includes(':') && // Avoid parsing markdown headers like "Technical Skills:"
      !existingSkills.includes(s.toLowerCase())
    );

    // Deduplicate array itself
    const uniqueNewSkills = [...new Set(parsedSkills)];

    // We have to add them one by one if there's no bulk endpoint
    // In a real app we'd want a bulk create endpoint for performance.
    for (const skillName of uniqueNewSkills) {
      await new Promise<void>((resolve) => {
        createSkill(
          { id: resumeId, data: { name: skillName, proficiency: 'Experienced' } },
          { onSettled: () => resolve() }
        );
      });
    }

    setIsUpdating(false);
    setGeneratedSkills('');
    setGeneratorOpen(false);
  };

  const handleReject = () => {
    setGeneratedSkills('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSkills.replace(/<[^>]*>?/gm, ''));
  };

  if (skillsLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Generating tailored skills...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Generated Skills</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Copy text">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col bg-indigo-50/30 rounded-xl border border-indigo-100 overflow-hidden relative shadow-sm flex-1">
        <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
          <span>AI Suggested Skills</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto">
          <RichTextEditor 
            value={generatedSkills} 
            onChange={setGeneratedSkills} 
            placeholder="Generated skills will appear here..." 
          />
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 p-3 rounded-lg">
        <strong>Note:</strong> We will extract the individual skill names from the text above and skip any you already have.
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <button 
          onClick={handleReject}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2"
        >
          <X className="w-4 h-4" /> Reject
        </button>
        <button 
          onClick={handleAccept}
          disabled={isUpdating}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
        >
          <Check className="w-4 h-4" /> 
          {isUpdating ? 'Extracting & Saving...' : 'Accept & Add Skills'}
        </button>
      </div>

    </div>
  );
};
