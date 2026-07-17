import React, { useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Users } from 'lucide-react';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { ReferenceCard } from './ReferenceCard';
import { useCreateReference, useReorderReference } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { ResumeReference } from '../../services/resume.api';

interface ReferenceSectionProps {
  resumeId: string;
  references: ResumeReference[];
}

export const ReferenceSection: React.FC<ReferenceSectionProps> = ({ resumeId, references }) => {
  const { mutate: createReference, isPending } = useCreateReference();
  const { mutate: reorderReference } = useReorderReference();
  const { liveReferences, setLiveReferences } = useResumeBuilderStore();

  useEffect(() => { setLiveReferences(references); }, [references]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveReferences.findIndex(r => r.id === active.id);
      const newIndex = liveReferences.findIndex(r => r.id === over.id);
      const reordered = arrayMove(liveReferences, oldIndex, newIndex).map((r, i) => ({ ...r, displayOrder: i }));
      setLiveReferences(reordered);
      reorderReference({ id: resumeId, data: { items: reordered.map(r => ({ id: r.id, displayOrder: r.displayOrder })) } });
    }
  };

  return (
    <div className="space-y-4">
      {liveReferences.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No references added yet.</p>
          <p className="text-xs mt-1">Strong references can seal the deal during hiring.</p>
        </div>
      ) : (
        <SortableList items={liveReferences} onDragEnd={handleDragEnd}>
          {liveReferences.map(r => <ReferenceCard key={r.id} reference={r} resumeId={resumeId} />)}
        </SortableList>
      )}
      <AddButton label="Add Reference" onClick={() => createReference({ id: resumeId, data: { name: 'New Reference', availableUponRequest: false } })} disabled={isPending} />
    </div>
  );
};
