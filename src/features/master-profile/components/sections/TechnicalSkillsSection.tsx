import React, { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { X, Plus } from 'lucide-react';

const PREDEFINED_CATEGORIES = [
  'Frontend',
  'Backend',
  'Programming Languages',
  'Database',
  'Cloud',
  'DevOps',
  'Testing',
  'Tools',
  'Operating Systems',
  'Others',
];

export const TechnicalSkillsSection: React.FC = () => {
  const { control, register, setValue, getValues } = useFormContext<MasterProfile>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills',
  });

  // Ensure predefined categories exist on mount if empty
  useEffect(() => {
    const currentSkills = getValues('skills') || [];
    if (currentSkills.length === 0) {
      PREDEFINED_CATEGORIES.forEach(category => {
        append({ category, tags: [] });
      });
    }
  }, [append, getValues]);

  // Handle Tag Input (Free-text for now, can be hooked to API later)
  const handleAddTag = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
      e.preventDefault();
      const currentTags = getValues(`skills.${index}.tags`) || [];
      const newTag = e.currentTarget.value.trim();
      
      if (!currentTags.includes(newTag)) {
        setValue(`skills.${index}.tags`, [...currentTags, newTag], { shouldDirty: true });
      }
      e.currentTarget.value = '';
    }
  };

  const handleRemoveTag = (index: number, tagToRemove: string) => {
    const currentTags = getValues(`skills.${index}.tags`) || [];
    setValue(
      `skills.${index}.tags`,
      currentTags.filter((tag) => tag !== tagToRemove),
      { shouldDirty: true }
    );
  };

  return (
    <section id="skills" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <h2 className="text-xl font-semibold text-slate-900 mb-6 pb-2 border-b">Technical Skills</h2>
      
      <div className="space-y-6">
        {fields.map((field, index) => {
          const tags = getValues(`skills.${index}.tags`) || [];
          
          return (
            <div key={field.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <input 
                  {...register(`skills.${index}.category`)}
                  className="font-medium bg-transparent border-none outline-none focus:ring-0 p-0 text-slate-800"
                  readOnly={PREDEFINED_CATEGORIES.includes(field.category)}
                />
                {!PREDEFINED_CATEGORIES.includes(field.category) && (
                  <button type="button" onClick={() => remove(index)} className="text-slate-400 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index, tag)}
                      className="hover:bg-blue-200 p-0.5 rounded-full transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              
              <input 
                type="text"
                placeholder="Type a skill and press Enter..."
                onKeyDown={(e) => handleAddTag(index, e)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          );
        })}
      </div>
      
      <button
        type="button"
        onClick={() => append({ category: 'New Category', tags: [] })}
        className="mt-4 flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Custom Category
      </button>
    </section>
  );
};
