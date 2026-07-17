import React from 'react';
import { GripVertical } from 'lucide-react';

export const DragHandle: React.FC<React.ComponentPropsWithoutRef<'button'>> = (props) => {
  return (
    <button
      type="button"
      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded cursor-grab active:cursor-grabbing transition-colors"
      {...props}
    >
      <GripVertical className="w-4 h-4" />
    </button>
  );
};
