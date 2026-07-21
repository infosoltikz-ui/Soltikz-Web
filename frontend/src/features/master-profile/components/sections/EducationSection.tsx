import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { Plus } from 'lucide-react';
import { DndList } from '../DndList';
import { CollapsibleCard } from '../CollapsibleCard';

export const EducationSection: React.FC = () => {
  const { control, register } = useFormContext<MasterProfile>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'educations',
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addEducation = () => {
    append({
      degree: '',
      specialization: '',
      university: '',
      college: '',
      percentageCgpa: '',
      startYear: '',
      endYear: '',
      educationType: '',
    });
  };

  return (
    <section id="education" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Education</h2>
        <button
          type="button"
          onClick={addEducation}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Education
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-3">No education records added yet.</p>
          <button
            type="button"
            onClick={addEducation}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add your first education
          </button>
        </div>
      ) : (
        <DndList items={fields} onDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <CollapsibleCard
              key={field.id}
              id={field.id}
              title={field.degree || `Education ${index + 1}`}
              subtitle={field.university || undefined}
              onRemove={() => remove(index)}
              defaultExpanded={!field.degree} // Open by default if empty
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Degree / Qualification *</label>
                  <input 
                    {...register(`educations.${index}.degree`)} 
                    placeholder="e.g. Bachelor of Science"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Specialization / Major</label>
                  <input 
                    {...register(`educations.${index}.specialization`)} 
                    placeholder="e.g. Computer Science"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">University / Board</label>
                  <input 
                    {...register(`educations.${index}.university`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">College / Institute</label>
                  <input 
                    {...register(`educations.${index}.college`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Year</label>
                  <input 
                    {...register(`educations.${index}.startYear`)} 
                    placeholder="YYYY"
                    maxLength={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Year / Expected</label>
                  <input 
                    {...register(`educations.${index}.endYear`)} 
                    placeholder="YYYY"
                    maxLength={4}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Percentage / CGPA</label>
                  <input 
                    {...register(`educations.${index}.percentageCgpa`)} 
                    placeholder="e.g. 3.8/4.0 or 85%"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Education Type</label>
                  <select 
                    {...register(`educations.${index}.educationType`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select...</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Distance">Distance Learning</option>
                  </select>
                </div>
              </div>
            </CollapsibleCard>
          ))}
        </DndList>
      )}
    </section>
  );
};
