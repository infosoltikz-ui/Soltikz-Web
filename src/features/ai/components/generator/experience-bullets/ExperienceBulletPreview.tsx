import React, { useState, useEffect } from 'react';
import { useAIStore } from '../../../store/useAIStore';
import { useResume } from '../../../../resume/hooks/resume.queries';
import { useUpdateExperience } from '../../../../resume/hooks/resume.queries';
import { Check, X, Copy, CheckSquare, Square } from 'lucide-react';

export const ExperienceBulletPreview: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { generatedExperienceBullets, setGeneratedExperienceBullets, experienceBulletsLoading, setGeneratorOpen, generatorSelectedId } = useAIStore();
  const { data: resume } = useResume(resumeId);
  const { mutate: updateExperience } = useUpdateExperience();
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedBullets, setSelectedBullets] = useState<Set<string>>(new Set());

  const experience = resume?.experiences?.find(e => e.id === generatorSelectedId);
  const currentDescription = experience?.description || '';

  // Parse bullets from the generated text
  const bullets = generatedExperienceBullets
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))
    .map(line => line.substring(1).trim())
    .filter(line => line.length > 0);

  // Auto-select all new bullets by default when generated text changes
  useEffect(() => {
    if (bullets.length > 0) {
      setSelectedBullets(new Set(bullets));
    } else {
      setSelectedBullets(new Set());
    }
  }, [generatedExperienceBullets]);

  const toggleBullet = (bullet: string) => {
    const newSelected = new Set(selectedBullets);
    if (newSelected.has(bullet)) {
      newSelected.delete(bullet);
    } else {
      newSelected.add(bullet);
    }
    setSelectedBullets(newSelected);
  };

  const handleAccept = () => {
    if (!generatorSelectedId || selectedBullets.size === 0) return;
    
    // Convert selected bullets into an HTML list item format suitable for RichTextEditor
    const bulletsHtml = Array.from(selectedBullets)
      .map(b => `<li>${b}</li>`)
      .join('');

    // Append to existing, wrapping in ul if needed, or just append HTML
    let newDescription = currentDescription;
    
    // Basic logic to append properly (assuming the RichTextEditor uses <ul><li>...</li></ul>)
    // If there's an existing <ul>, insert into it. Otherwise create a new <ul>.
    if (newDescription.includes('</ul>')) {
      newDescription = newDescription.replace('</ul>', `${bulletsHtml}</ul>`);
    } else if (newDescription.trim() === '') {
      newDescription = `<ul>${bulletsHtml}</ul>`;
    } else {
      newDescription = `${newDescription}<ul>${bulletsHtml}</ul>`;
    }
    
    setIsUpdating(true);
    updateExperience(
      { 
        id: resumeId, 
        expId: generatorSelectedId, 
        data: { description: newDescription } 
      },
      {
        onSuccess: () => {
          setIsUpdating(false);
          setGeneratedExperienceBullets('');
          setGeneratorOpen(false);
        },
        onError: () => {
          setIsUpdating(false);
        }
      }
    );
  };

  const handleReject = () => {
    setGeneratedExperienceBullets('');
  };

  const handleCopy = () => {
    const textToCopy = Array.from(selectedBullets).map(b => `• ${b}`).join('\n');
    navigator.clipboard.writeText(textToCopy);
  };

  if (experienceBulletsLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-sm text-slate-500 font-medium animate-pulse">Crafting impactful bullet points...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800">Generated Bullet Points</h3>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100" title="Copy selected">
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full min-h-[300px]">
        {/* Original */}
        {currentDescription && (
          <div className="flex-1 flex flex-col bg-slate-50 rounded-xl border border-slate-200 overflow-hidden opacity-75">
            <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Current Description
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
               <div dangerouslySetInnerHTML={{ __html: currentDescription }} className="prose prose-sm max-w-none text-slate-500" />
            </div>
          </div>
        )}

        {/* Generated Checklist */}
        <div className="flex-[2] flex flex-col bg-white rounded-xl border border-indigo-100 overflow-hidden relative shadow-sm">
          <div className="px-4 py-2 bg-indigo-50 border-b border-indigo-100 text-xs font-semibold text-indigo-700 uppercase tracking-wider flex items-center justify-between">
            <span>Select Bullet Points to Add</span>
            <span className="text-[10px] bg-indigo-100 px-2 py-0.5 rounded-full text-indigo-600 normal-case">{selectedBullets.size} selected</span>
          </div>
          <div className="p-2 flex-1 overflow-y-auto space-y-1">
            {bullets.length > 0 ? (
              bullets.map((bullet, idx) => (
                <div 
                  key={idx} 
                  onClick={() => toggleBullet(bullet)}
                  className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedBullets.has(bullet) ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="pt-0.5">
                    {selectedBullets.has(bullet) ? (
                      <CheckSquare className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-300" />
                    )}
                  </div>
                  <p className={`text-sm ${selectedBullets.has(bullet) ? 'text-slate-800' : 'text-slate-500'}`}>
                    {bullet}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-sm text-slate-500 italic whitespace-pre-wrap">
                {generatedExperienceBullets}
              </div>
            )}
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
          disabled={isUpdating || selectedBullets.size === 0}
          className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
        >
          <Check className="w-4 h-4" /> 
          {isUpdating ? 'Saving...' : 'Accept Selected'}
        </button>
      </div>

    </div>
  );
};
