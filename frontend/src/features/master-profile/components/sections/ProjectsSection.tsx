import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { Plus } from 'lucide-react';
import { DndList } from '../DndList';
import { CollapsibleCard } from '../CollapsibleCard';
import { RichTextEditor } from '../RichTextEditor';

export const ProjectsSection: React.FC = () => {
  const { control, register } = useFormContext<MasterProfile>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'projects',
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addProject = () => {
    append({
      projectName: '',
      client: '',
      role: '',
      businessDomain: '',
      description: '',
      responsibilities: '',
      technologyStack: '',
      environment: '',
      duration: '',
      teamSize: '',
      methodology: '',
      achievements: '',
    });
  };

  return (
    <section id="projects" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Projects</h2>
        <button
          type="button"
          onClick={addProject}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-3">No projects added yet.</p>
          <button
            type="button"
            onClick={addProject}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add your first project
          </button>
        </div>
      ) : (
        <DndList items={fields} onDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <CollapsibleCard
              key={field.id}
              id={field.id}
              title={field.projectName || `Project ${index + 1}`}
              subtitle={field.role || undefined}
              onRemove={() => remove(index)}
              defaultExpanded={!field.projectName}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Project Name *</label>
                  <input 
                    {...register(`projects.${index}.projectName`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role / Designation</label>
                  <input 
                    {...register(`projects.${index}.role`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client (if applicable)</label>
                  <input 
                    {...register(`projects.${index}.client`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Business Domain</label>
                  <input 
                    {...register(`projects.${index}.businessDomain`)} 
                    placeholder="e.g. Healthcare, Finance, E-commerce"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                  <input 
                    {...register(`projects.${index}.duration`)} 
                    placeholder="e.g. 6 Months, Jan 2023 - Present"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team Size</label>
                  <input 
                    {...register(`projects.${index}.teamSize`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>

                <div className="md:col-span-2 mt-2">
                  <RichTextEditor 
                    name={`projects.${index}.description`}
                    label="Project Description"
                    placeholder="Provide a high-level overview of the project..."
                    height={150}
                  />
                </div>

                <div className="md:col-span-2 mt-2">
                  <RichTextEditor 
                    name={`projects.${index}.responsibilities`}
                    label="Your Responsibilities"
                    placeholder="Describe your specific contributions to this project..."
                    height={200}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Technology Stack</label>
                  <input 
                    {...register(`projects.${index}.technologyStack`)} 
                    placeholder="e.g. React, Node.js, AWS, PostgreSQL"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
            </CollapsibleCard>
          ))}
        </DndList>
      )}
    </section>
  );
};
