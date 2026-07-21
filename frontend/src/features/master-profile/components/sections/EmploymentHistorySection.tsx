import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { Plus } from 'lucide-react';
import { DndList } from '../DndList';
import { CollapsibleCard } from '../CollapsibleCard';
import { RichTextEditor } from '../RichTextEditor';

export const EmploymentHistorySection: React.FC = () => {
  const { control, register } = useFormContext<MasterProfile>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'employments',
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addEmployment = () => {
    append({
      company: '',
      client: '',
      designation: '',
      employmentType: '',
      startDate: '',
      endDate: '',
      currentCompany: false,
      location: '',
      responsibilities: '',
      environment: '',
      technologyStack: '',
      achievements: '',
    });
  };

  return (
    <section id="employment" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Employment History</h2>
        <button
          type="button"
          onClick={addEmployment}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Employment
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-3">No employment records added yet.</p>
          <button
            type="button"
            onClick={addEmployment}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add your first employment
          </button>
        </div>
      ) : (
        <DndList items={fields} onDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <CollapsibleCard
              key={field.id}
              id={field.id}
              title={field.company || `Employment ${index + 1}`}
              subtitle={field.designation || undefined}
              onRemove={() => remove(index)}
              defaultExpanded={!field.company}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Company Name *</label>
                  <input 
                    {...register(`employments.${index}.company`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Client Name (if applicable)</label>
                  <input 
                    {...register(`employments.${index}.client`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation / Role</label>
                  <input 
                    {...register(`employments.${index}.designation`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Employment Type</label>
                  <select 
                    {...register(`employments.${index}.employmentType`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">Select...</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input 
                    {...register(`employments.${index}.startDate`)} 
                    placeholder="MM/YYYY"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center justify-between">
                    <span>End Date</span>
                    <label className="flex items-center gap-1.5 text-xs font-normal text-blue-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        {...register(`employments.${index}.currentCompany`)} 
                        className="rounded border-blue-400 text-blue-600 focus:ring-blue-500"
                      />
                      I currently work here
                    </label>
                  </label>
                  <input 
                    {...register(`employments.${index}.endDate`)} 
                    placeholder="MM/YYYY"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                
                <div className="md:col-span-2 mt-2">
                  <RichTextEditor 
                    name={`employments.${index}.responsibilities`}
                    label="Roles & Responsibilities"
                    placeholder="Describe your day-to-day responsibilities and key deliverables..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Technology Stack</label>
                  <input 
                    {...register(`employments.${index}.technologyStack`)} 
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
