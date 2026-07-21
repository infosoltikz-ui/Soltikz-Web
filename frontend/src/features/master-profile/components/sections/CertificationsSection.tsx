import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { Plus } from 'lucide-react';
import { DndList } from '../DndList';
import { CollapsibleCard } from '../CollapsibleCard';

export const CertificationsSection: React.FC = () => {
  const { control, register } = useFormContext<MasterProfile>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'certifications',
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addCertification = () => {
    append({
      name: '',
      organization: '',
      completionDate: '',
      credentialId: '',
      credentialUrl: '',
      skillsCovered: '',
    });
  };

  return (
    <section id="certifications" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Certifications</h2>
        <button
          type="button"
          onClick={addCertification}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Certification
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-3">No certifications added yet.</p>
          <button
            type="button"
            onClick={addCertification}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add your first certification
          </button>
        </div>
      ) : (
        <DndList items={fields} onDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <CollapsibleCard
              key={field.id}
              id={field.id}
              title={field.name || `Certification ${index + 1}`}
              subtitle={field.organization || undefined}
              onRemove={() => remove(index)}
              defaultExpanded={!field.name}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Certification Name *</label>
                  <input 
                    {...register(`certifications.${index}.name`)} 
                    placeholder="e.g. AWS Certified Solutions Architect"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Issuing Organization</label>
                  <input 
                    {...register(`certifications.${index}.organization`)} 
                    placeholder="e.g. Amazon Web Services"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Completion / Issue Date</label>
                  <input 
                    {...register(`certifications.${index}.completionDate`)} 
                    placeholder="MM/YYYY"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Credential ID</label>
                  <input 
                    {...register(`certifications.${index}.credentialId`)} 
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Credential URL</label>
                  <input 
                    {...register(`certifications.${index}.credentialUrl`)} 
                    type="url"
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Skills Covered</label>
                  <input 
                    {...register(`certifications.${index}.skillsCovered`)} 
                    placeholder="e.g. Cloud Computing, Networking, Security"
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
