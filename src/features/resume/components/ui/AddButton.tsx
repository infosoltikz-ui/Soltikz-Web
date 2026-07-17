import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  label: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ label, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`w-full flex items-center justify-center gap-2 py-3 px-4 border border-dashed border-primary-300 text-primary-600 rounded-xl hover:bg-primary-50 hover:border-primary-400 transition-colors ${className}`}
      {...props}
    >
      <Plus className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </button>
  );
};
