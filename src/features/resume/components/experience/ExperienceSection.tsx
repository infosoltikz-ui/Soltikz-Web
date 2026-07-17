import React, { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { Resume, ResumeExperience } from '../../services/resume.api';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { useCreateExperience, useReorderExperience } from '../../hooks/resume.queries';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceSectionProps {
  resume: Resume;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ resume }) => {
  const { liveExperiences, setLiveExperiences } = useResumeBuilderStore();
  const { mutate: createExperience } = useCreateExperience();
  const { mutate: reorderExperience } = useReorderExperience();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveExperiences.findIndex((item) => item.id === active.id);
      const newIndex = liveExperiences.findIndex((item) => item.id === over.id);

      const newExperiences = [...liveExperiences];
      const [movedItem] = newExperiences.splice(oldIndex, 1);
      newExperiences.splice(newIndex, 0, movedItem);

      const updatedExperiences = newExperiences.map((exp, index) => ({
        ...exp,
        displayOrder: index,
      }));

      setLiveExperiences(updatedExperiences);

      reorderExperience({
        id: resume.id,
        data: {
          items: updatedExperiences.map((exp) => ({ id: exp.id, displayOrder: exp.displayOrder })),
        },
      });
    }
  };

  const handleAddExperience = () => {
    createExperience({
      id: resume.id,
      data: {
        companyName: 'New Company',
        jobTitle: 'Job Title',
        currentlyWorking: false,
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Employment History</h2>
        <p className="text-slate-500 mt-1">Show your relevant experience (last 10 years).</p>
      </div>

      {liveExperiences.length > 0 ? (
        <div className="mb-6">
          <SortableList items={liveExperiences} onDragEnd={handleDragEnd}>
            {liveExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} resumeId={resume.id} />
            ))}
          </SortableList>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-xl">💼</span>
          </div>
          <h3 className="text-slate-900 font-medium mb-1">No experience added</h3>
          <p className="text-slate-500 text-sm">Add your first role to get started.</p>
        </div>
      )}

      <AddButton label="Add Employment" onClick={handleAddExperience} />
    </div>
  );
};
