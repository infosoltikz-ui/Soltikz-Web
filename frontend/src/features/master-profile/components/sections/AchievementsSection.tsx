import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { MasterProfile } from '../../types/masterProfile';
import { Plus } from 'lucide-react';
import { DndList } from '../DndList';
import { CollapsibleCard } from '../CollapsibleCard';
import { RichTextEditor } from '../RichTextEditor';

export const AchievementsSection: React.FC = () => {
  const { control } = useFormContext<MasterProfile>();
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'achievements',
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
    }
  };

  const addAchievement = () => {
    append({ description: '' });
  };

  return (
    <section id="achievements" className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm scroll-mt-24">
      <div className="flex items-center justify-between mb-6 pb-2 border-b">
        <h2 className="text-xl font-semibold text-slate-900">Key Achievements</h2>
        <button
          type="button"
          onClick={addAchievement}
          className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Achievement
        </button>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 mb-3">No achievements added yet.</p>
          <button
            type="button"
            onClick={addAchievement}
            className="text-blue-600 font-medium hover:underline"
          >
            + Add your first achievement
          </button>
        </div>
      ) : (
        <DndList items={fields} onDragEnd={handleDragEnd}>
          {fields.map((field, index) => (
            <CollapsibleCard
              key={field.id}
              id={field.id}
              title={`Achievement ${index + 1}`}
              onRemove={() => remove(index)}
              defaultExpanded={true}
            >
              <div className="w-full">
                <RichTextEditor 
                  name={`achievements.${index}.description`}
                  placeholder="Describe your major accomplishments..."
                  height={150}
                />
              </div>
            </CollapsibleCard>
          ))}
        </DndList>
      )}
    </section>
  );
};
