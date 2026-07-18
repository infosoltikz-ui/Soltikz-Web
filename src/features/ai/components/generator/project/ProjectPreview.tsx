import React, { useState } from 'react';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { useUpdateProject } from '../../../../resume/hooks/resume.queries';
import { Check, X, Copy } from 'lucide-react';
import { RichTextEditor } from '../../../../resume/components/RichTextEditor';

export const ProjectPreview: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { generatedProject, setGeneratedProject, projectLoading, setGeneratorOpen, generatorSelectedId } = useAIStore();
  const { data: resume } = useResume(resumeId);
  const { mutate: updateProject } = useUpdateProject();
  const [isUpdating, setIsUpdating] = useState(false);

  const project = resume?.projects?.find(p => p.id === generatorSelectedId);
  const currentDescription = project?.description || '';

  const handleAccept = () => {
    if (!generatorSelectedId || !generatedProject) return;
    
    setIsUpdating(true);
    updateProject(
      { 
        id: resumeId, 
        projectId: generatorSelectedId, 
        data: { description: generatedProject } 
      },
      {
        onSuccess: () => {
          setIsUpdating(false);
          setGeneratedProject('');
          setGeneratorOpen(false);
        },
        onError: () => {
          setIsUpdating(false);
        }
      }
    );
  };

  const handleReject = () => {
    setGeneratedProject('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedProject.replace(/<[^>]*>?/gm, ''));
  };

  if (projectLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Drafting project description...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Generated Project Description</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Copy text">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full min-h-[300px]">
        {/* Original */}
        {currentDescription && (
          <div className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden opacity-75">
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Original
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
               <div dangerouslySetInnerHTML={{ __html: currentDescription }} className="prose prose-sm max-w-none text-slate-500" />
            </div>
          </div>
        )}

        {/* Generated */}
        <div className="flex-[2] flex flex-col bg-indigo-50/30 rounded-xl border border-indigo-100 overflow-hidden relative shadow-sm">
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
            <span>AI Suggestion</span>
            <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded-full text-indigo-600 normal-case">Editable</span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto">
            <RichTextEditor 
              value={generatedProject} 
              onChange={setGeneratedProject} 
              placeholder="Generated description will appear here..." 
            />
          </div>
        </div>
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
          {isUpdating ? 'Saving...' : 'Accept Changes'}
        </button>
      </div>

    </div>
  );
};
