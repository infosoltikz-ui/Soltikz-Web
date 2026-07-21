import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { SortableItem } from '../ui/SortableItem';
import { DragHandle } from '../ui/DragHandle';
import { DeleteDialog } from '../ui/DeleteDialog';
import { ResumeAchievement } from '../../services/resume.api';
import { useDeleteAchievement } from '../../hooks/resume.queries';
import { AchievementForm } from './AchievementForm';

interface AchievementCardProps {
  achievement: ResumeAchievement;
  resumeId: string;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({ achievement, resumeId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { mutate: deleteAchievement } = useDeleteAchievement();

  const handleDelete = () => {
    deleteAchievement({ id: resumeId, achievementId: achievement.id });
    setShowDelete(false);
  };

  return (
    <SortableItem id={achievement.id}>
      {({ attributes, listeners, setNodeRef, style, isDragging }) => (
        <div
          ref={setNodeRef}
          style={style}
          className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${
            isDragging ? 'border-primary-400 shadow-lg scale-[1.02] z-10' : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center gap-3 p-4 bg-white cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div onClick={(e) => e.stopPropagation()} className="shrink-0">
              <DragHandle {...attributes} {...listeners} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-900 font-medium truncate">{achievement.title || '(Not specified)'}</h4>
              <p className="text-slate-500 text-sm truncate">{achievement.achievementDate || ''}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setShowDelete(true)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
          </div>
          {isExpanded && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/50">
              <AchievementForm achievement={achievement} resumeId={resumeId} />
            </div>
          )}
          <DeleteDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete Achievement" description="Are you sure you want to delete this achievement?" />
        </div>
      )}
    </SortableItem>
  );
};
