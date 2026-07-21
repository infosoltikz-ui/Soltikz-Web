import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { Plus, X } from 'lucide-react';

export const LanguagesSection: React.FC = () => {
  const { control, register } = useFormContext<MasterProfile>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages',
  });

  const addLanguage = () => {
    append({
      language: '',
      canRead: false,
      canWrite: false,
      canSpeak: false,
    });
  };

  return (
    <section id="languages" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Languages</h2>
        <button
          type="button"
          onClick={addLanguage}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Language
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-3">No languages added yet.</p>
          <button
            type="button"
            onClick={addLanguage}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add your first language
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex-1">
                <input 
                  {...register(`languages.${index}.language`)} 
                  placeholder="e.g. English, Spanish, French"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" 
                />
              </div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register(`languages.${index}.canRead`)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  Read
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register(`languages.${index}.canWrite`)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  Write
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                  <input type="checkbox" {...register(`languages.${index}.canSpeak`)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                  Speak
                </label>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end md:self-center ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
