import React from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Controller, useFormContext } from 'react-hook-form';

interface RichTextEditorProps {
  name: string;
  label?: string;
  placeholder?: string;
  height?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ 
  name, 
  label, 
  placeholder,
  height = 200 
}) => {
  const { control } = useFormContext();

  return (
    <div className="w-full" data-color-mode="light">
      {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange } }) => (
          <MDEditor
            value={value || ''}
            onChange={(val) => onChange(val || '')}
            height={height}
            preview="edit"
            textareaProps={{
              placeholder: placeholder || 'Type here...'
            }}
            className="border border-slate-200 shadow-none !rounded-lg overflow-hidden"
          />
        )}
      />
    </div>
  );
};
