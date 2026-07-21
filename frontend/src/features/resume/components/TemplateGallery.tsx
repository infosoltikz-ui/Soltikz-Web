import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { useResumeBuilderStore } from '../store/useResumeBuilderStore';
import { useUpdateTemplate } from '../hooks/resume.queries';
import { RESUME_TEMPLATES } from '../templates/resume.templates';

interface GalleryProps {
  resumeId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateGallery: React.FC<GalleryProps> = ({ resumeId, isOpen, onClose }) => {
  const { liveSettings, setLiveSettings } = useResumeBuilderStore();
  const updateTemplate = useUpdateTemplate();

  if (!isOpen) return null;

  const handleSelect = (templateId: string) => {
    setLiveSettings({ selectedTemplate: templateId });
    updateTemplate.mutate({ id: resumeId, data: { selectedTemplate: templateId } });
    onClose();
  };

  const currentTemplate = liveSettings.selectedTemplate || 'modern';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Template Gallery</h2>
            <p className="text-slate-500 mt-1">Select a professional design for your resume.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESUME_TEMPLATES.map((tpl) => {
              const isSelected = currentTemplate === tpl.id;
              return (
                <div 
                  key={tpl.id}
                  className={`group bg-white rounded-xl border-2 transition-all cursor-pointer overflow-hidden flex flex-col
                    ${isSelected ? 'border-primary-500 ring-4 ring-primary-50' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}
                  onClick={() => handleSelect(tpl.id)}
                >
                  <div className="relative aspect-[1/1.4] bg-slate-100 overflow-hidden border-b border-slate-100">
                    {/* Fallback placeholder if image not found */}
                    <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-medium text-lg bg-slate-100">
                      Preview {tpl.name}
                    </div>
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-primary-500 text-white rounded-full p-1 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    {tpl.isPremium && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
                        PREMIUM
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-bold text-slate-800 text-lg">{tpl.name}</h3>
                      {tpl.isAtsFriendly && (
                        <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          ATS Friendly
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mb-4 flex-1">{tpl.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {tpl.recommendedFor.map(rec => (
                        <span key={rec} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
