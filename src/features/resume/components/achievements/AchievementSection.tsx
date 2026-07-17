import React, { useEffect } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { DragEndEvent } from '@dnd-kit/core';
import { Trophy } from 'lucide-react';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { AchievementCard } from './AchievementCard';
import { useCreateAchievement, useReorderAchievement } from '../../hooks/resume.queries';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { ResumeAchievement } from '../../services/resume.api';

interface AchievementSectionProps {
  resumeId: string;
  achievements: ResumeAchievement[];
}

export const AchievementSection: React.FC<AchievementSectionProps> = ({ resumeId, achievements }) => {
  const { mutate: createAchievement, isPending } = useCreateAchievement();
  const { mutate: reorderAchievement } = useReorderAchievement();
  const { liveAchievements, setLiveAchievements } = useResumeBuilderStore();

  useEffect(() => { setLiveAchievements(achievements); }, [achievements]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveAchievements.findIndex(a => a.id === active.id);
      const newIndex = liveAchievements.findIndex(a => a.id === over.id);
      const reordered = arrayMove(liveAchievements, oldIndex, newIndex).map((a, i) => ({ ...a, displayOrder: i }));
      setLiveAchievements(reordered);
      reorderAchievement({ id: resumeId, data: { items: reordered.map(a => ({ id: a.id, displayOrder: a.displayOrder })) } });
    }
  };

  return (
    <div className="space-y-4">
      {liveAchievements.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No achievements added yet.</p>
          <p className="text-xs mt-1">Showcase your notable accomplishments.</p>
        </div>
      ) : (
        <SortableList items={liveAchievements} onDragEnd={handleDragEnd}>
          {liveAchievements.map(a => <AchievementCard key={a.id} achievement={a} resumeId={resumeId} />)}
        </SortableList>
      )}
      <AddButton label="Add Achievement" onClick={() => createAchievement({ id: resumeId, data: { title: 'New Achievement' } })} disabled={isPending} />
    </div>
  );
};
