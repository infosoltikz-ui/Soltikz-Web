import React, { useState } from 'react';
import { ChevronDown, ChevronUp, GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CollapsibleCardProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onRemove: () => void;
  defaultExpanded?: boolean;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  id,
  title,
  subtitle,
  children,
  onRemove,
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // Setup DnD sortable for this card
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 mb-4 ${
        isDragging ? 'border-blue-400 shadow-lg scale-[1.01]' : 'border-slate-200 shadow-sm'
      }`}
    >
      {/* Card Header (Drag Handle & Title) */}
      <div 
        className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-100 group"
      >
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          {/* Drag Handle */}
          <button 
            type="button"
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 focus:outline-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex-1 text-left focus:outline-none truncate"
          >
            <h3 className="font-semibold text-slate-800 truncate">{title || 'New Item'}</h3>
            {subtitle && !isExpanded && (
              <p className="text-sm text-slate-500 truncate">{subtitle}</p>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 pl-4">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors focus:outline-none"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Body */}
      {isExpanded && (
        <div className="p-5">
          {children}
        </div>
      )}
    </div>
  );
};
