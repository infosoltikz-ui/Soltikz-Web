import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { Resume } from '../../services/resume.api';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { useCreateSkill, useReorderSkill } from '../../hooks/resume.queries';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { SkillCard } from './SkillCard';

interface SkillsSectionProps {
  resume: Resume;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ resume }) => {
  const { liveSkills, setLiveSkills } = useResumeBuilderStore();
  const { mutate: createSkill } = useCreateSkill();
  const { mutate: reorderSkill } = useReorderSkill();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveSkills.findIndex((item) => item.id === active.id);
      const newIndex = liveSkills.findIndex((item) => item.id === over.id);

      const newSkills = [...liveSkills];
      const [movedItem] = newSkills.splice(oldIndex, 1);
      newSkills.splice(newIndex, 0, movedItem);

      const updatedSkills = newSkills.map((skill, index) => ({
        ...skill,
        displayOrder: index,
      }));

      setLiveSkills(updatedSkills);

      reorderSkill({
        id: resume.id,
        data: {
          items: updatedSkills.map((skill) => ({ id: skill.id, displayOrder: skill.displayOrder })),
        },
      });
    }
  };

  const handleAddSkill = () => {
    createSkill({
      id: resume.id,
      data: {
        name: 'New Skill',
        proficiency: 'Beginner',
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Skills</h2>
        <p className="text-slate-500 mt-1">Choose 5 of the most important skills to show your talents!</p>
      </div>

      {liveSkills.length > 0 ? (
        <div className="mb-6">
          <SortableList items={liveSkills} onDragEnd={handleDragEnd}>
            {liveSkills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} resumeId={resume.id} />
            ))}
          </SortableList>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-xl">🛠️</span>
          </div>
          <h3 className="text-slate-900 font-medium mb-1">No skills added</h3>
          <p className="text-slate-500 text-sm">Add your technical and soft skills.</p>
        </div>
      )}

      <AddButton label="Add Skill" onClick={handleAddSkill} />
    </div>
  );
};
