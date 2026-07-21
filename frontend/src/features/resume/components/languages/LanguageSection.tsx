import React, { useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Languages } from 'lucide-react';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { LanguageCard } from './LanguageCard';
import { useCreateLanguage, useReorderLanguage } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { ResumeLanguage } from '../../services/resume.api';

interface LanguageSectionProps {
  resumeId: string;
  languages: ResumeLanguage[];
}

export const LanguageSection: React.FC<LanguageSectionProps> = ({ resumeId, languages }) => {
  const { mutate: createLanguage, isPending } = useCreateLanguage();
  const { mutate: reorderLanguage } = useReorderLanguage();
  const { liveLanguages, setLiveLanguages } = useResumeBuilderStore();

  useEffect(() => {
    setLiveLanguages(languages);
  }, [languages]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveLanguages.findIndex(l => l.id === active.id);
      const newIndex = liveLanguages.findIndex(l => l.id === over.id);
      const reordered = arrayMove(liveLanguages, oldIndex, newIndex).map((l, i) => ({ ...l, displayOrder: i }));
      setLiveLanguages(reordered);
      reorderLanguage({ id: resumeId, data: { items: reordered.map(l => ({ id: l.id, displayOrder: l.displayOrder })) } });
    }
  };

  return (
    <div className="space-y-4">
      {liveLanguages.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Languages className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No languages added yet.</p>
          <p className="text-xs mt-1">Highlight your linguistic capabilities.</p>
        </div>
      ) : (
        <SortableList items={liveLanguages} onDragEnd={handleDragEnd}>
          {liveLanguages.map((lang) => (
            <LanguageCard key={lang.id} language={lang} resumeId={resumeId} />
          ))}
        </SortableList>
      )}
      <AddButton label="Add Language" onClick={() => createLanguage({ id: resumeId, data: { language: 'New Language', proficiency: 'Intermediate' } })} disabled={isPending} />
    </div>
  );
};
