import React, { useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Medal } from 'lucide-react';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { AwardCard } from './AwardCard';
import { useCreateAward, useReorderAward } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { ResumeAward } from '../../services/resume.api';

interface AwardSectionProps {
  resumeId: string;
  awards: ResumeAward[];
}

export const AwardSection: React.FC<AwardSectionProps> = ({ resumeId, awards }) => {
  const { mutate: createAward, isPending } = useCreateAward();
  const { mutate: reorderAward } = useReorderAward();
  const { liveAwards, setLiveAwards } = useResumeBuilderStore();

  useEffect(() => { setLiveAwards(awards); }, [awards]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveAwards.findIndex(a => a.id === active.id);
      const newIndex = liveAwards.findIndex(a => a.id === over.id);
      const reordered = arrayMove(liveAwards, oldIndex, newIndex).map((a, i) => ({ ...a, displayOrder: i }));
      setLiveAwards(reordered);
      reorderAward({ id: resumeId, data: { items: reordered.map(a => ({ id: a.id, displayOrder: a.displayOrder })) } });
    }
  };

  return (
    <div className="space-y-4">
      {liveAwards.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Medal className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No awards added yet.</p>
          <p className="text-xs mt-1">Recognition for excellence distinguishes top candidates.</p>
        </div>
      ) : (
        <SortableList items={liveAwards} onDragEnd={handleDragEnd}>
          {liveAwards.map(a => <AwardCard key={a.id} award={a} resumeId={resumeId} />)}
        </SortableList>
      )}
      <AddButton label="Add Award" onClick={() => createAward({ id: resumeId, data: { awardName: 'New Award' } })} disabled={isPending} />
    </div>
  );
};
