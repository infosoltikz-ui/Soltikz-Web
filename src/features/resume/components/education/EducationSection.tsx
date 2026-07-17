import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { Resume } from '../../services/resume.api';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { useCreateEducation, useReorderEducation } from '../../hooks/resume.queries';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { EducationCard } from './EducationCard';

interface EducationSectionProps {
  resume: Resume;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ resume }) => {
  const { liveEducations, setLiveEducations } = useResumeBuilderStore();
  const { mutate: createEducation } = useCreateEducation();
  const { mutate: reorderEducation } = useReorderEducation();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveEducations.findIndex((item) => item.id === active.id);
      const newIndex = liveEducations.findIndex((item) => item.id === over.id);

      const newEducations = [...liveEducations];
      const [movedItem] = newEducations.splice(oldIndex, 1);
      newEducations.splice(newIndex, 0, movedItem);

      const updatedEducations = newEducations.map((edu, index) => ({
        ...edu,
        displayOrder: index,
      }));

      setLiveEducations(updatedEducations);

      reorderEducation({
        id: resume.id,
        data: {
          items: updatedEducations.map((edu) => ({ id: edu.id, displayOrder: edu.displayOrder })),
        },
      });
    }
  };

  const handleAddEducation = () => {
    createEducation({
      id: resume.id,
      data: {
        institution: 'New Institution',
        currentlyStudying: false,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Education</h2>
        <p className="text-slate-500 mt-1">A varied education on your resume sums up the value that your learnings and background will bring to job.</p>
      </div>

      {liveEducations.length > 0 ? (
        <div className="mb-6">
          <SortableList items={liveEducations} onDragEnd={handleDragEnd}>
            {liveEducations.map((edu) => (
              <EducationCard key={edu.id} education={edu} resumeId={resume.id} />
            ))}
          </SortableList>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-xl">🎓</span>
          </div>
          <h3 className="text-slate-900 font-medium mb-1">No education added</h3>
          <p className="text-slate-500 text-sm">Add your educational background.</p>
        </div>
      )}

      <AddButton label="Add Education" onClick={handleAddEducation} />
    </div>
  );
};
