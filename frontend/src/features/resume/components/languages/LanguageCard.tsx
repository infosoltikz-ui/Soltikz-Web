import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { SortableItem } from '../ui/SortableItem';
import { DragHandle } from '../ui/DragHandle';
import { DeleteDialog } from '../ui/DeleteDialog';
import { ResumeLanguage } from '../../services/resume.api';
import { useDeleteLanguage } from '../../hooks/resume.queries';
import { LanguageForm } from './LanguageForm';

const PROFICIENCY_COLORS: Record<string, string> = {
  Native: 'bg-violet-100 text-violet-700',
  Fluent: 'bg-emerald-100 text-emerald-700',
  Advanced: 'bg-blue-100 text-blue-700',
  Intermediate: 'bg-amber-100 text-amber-700',
  Beginner: 'bg-slate-100 text-slate-600',
};

interface LanguageCardProps {
  language: ResumeLanguage;
  resumeId: string;
}

export const LanguageCard: React.FC<LanguageCardProps> = ({ language, resumeId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { mutate: deleteLanguage } = useDeleteLanguage();

  const handleDelete = () => {
    deleteLanguage({ id: resumeId, langId: language.id });
    setShowDelete(false);
  };

  return (
    <SortableItem id={language.id}>
      {({ attributes, listeners, setNodeRef, style, isDragging }) => (
        <div
          ref={setNodeRef}
          style={style}
          className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
            isDragging ? 'border-primary-400 shadow-lg scale-[1.02] z-10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div
            className="flex items-center gap-3 p-4 bg-white cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <DragHandle {...attributes} {...listeners} />
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <h4 className="text-slate-900 font-medium truncate">
                {language.language || '(Not specified)'}
              </h4>
              {language.proficiency && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${PROFICIENCY_COLORS[language.proficiency] || 'bg-slate-100 text-slate-600'}`}>
                  {language.proficiency}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setShowDelete(true)}
                className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isExpanded && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <LanguageForm language={language} resumeId={resumeId} />
            </div>
          )}

          <DeleteDialog
            isOpen={showDelete}
            onClose={() => setShowDelete(false)}
            onConfirm={handleDelete}
            title="Delete Language"
            description="Are you sure you want to delete this language entry?"
          />
        </div>
      )}
    </SortableItem>
  );
};
