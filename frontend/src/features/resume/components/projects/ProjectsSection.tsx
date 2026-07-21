import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { Resume } from '../../services/resume.api';
import { useResumeBuilderStore } from '../../store/useResumeBuilderStore';
import { useCreateProject, useReorderProject } from '../../hooks/resume.queries';
import { SortableList } from '../ui/SortableList';
import { AddButton } from '../ui/AddButton';
import { ProjectCard } from './ProjectCard';

interface ProjectsSectionProps {
  resume: Resume;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ resume }) => {
  const { liveProjects, setLiveProjects } = useResumeBuilderStore();
  const { mutate: createProject } = useCreateProject();
  const { mutate: reorderProject } = useReorderProject();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = liveProjects.findIndex((item) => item.id === active.id);
      const newIndex = liveProjects.findIndex((item) => item.id === over.id);

      const newProjects = [...liveProjects];
      const [movedItem] = newProjects.splice(oldIndex, 1);
      newProjects.splice(newIndex, 0, movedItem);

      const updatedProjects = newProjects.map((proj, index) => ({
        ...proj,
        displayOrder: index,
      }));

      setLiveProjects(updatedProjects);

      reorderProject({
        id: resume.id,
        data: {
          items: updatedProjects.map((proj) => ({ id: proj.id, displayOrder: proj.displayOrder })),
        },
      });
    }
  };

  const handleAddProject = () => {
    createProject({
      id: resume.id,
      data: {
        title: 'New Project',
        featured: false,
        technologies: [],
      },
    });
  };

  return (
    <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
        <p className="text-slate-500 mt-1">Showcase your notable projects and technical achievements.</p>
      </div>

      {liveProjects.length > 0 ? (
        <div className="mb-6">
          <SortableList items={liveProjects} onDragEnd={handleDragEnd}>
            {liveProjects.map((proj) => (
              <ProjectCard key={proj.id} project={proj} resumeId={resume.id} />
            ))}
          </SortableList>
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center mb-6">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
            <span className="text-xl">🚀</span>
          </div>
          <h3 className="text-slate-900 font-medium mb-1">No projects added</h3>
          <p className="text-slate-500 text-sm">Add a project to showcase your skills in action.</p>
        </div>
      )}

      <AddButton label="Add Project" onClick={handleAddProject} />
    </div>
  );
};
