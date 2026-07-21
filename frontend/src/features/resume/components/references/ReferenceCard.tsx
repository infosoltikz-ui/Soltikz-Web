import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { SortableItem } from '../ui/SortableItem';
import { DragHandle } from '../ui/DragHandle';
import { DeleteDialog } from '../ui/DeleteDialog';
import { ResumeReference } from '../../services/resume.api';
import { useDeleteReference } from '../../hooks/resume.queries';
import { ReferenceForm } from './ReferenceForm';

interface ReferenceCardProps {
  reference: ResumeReference;
  resumeId: string;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference, resumeId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { mutate: deleteReference } = useDeleteReference();

  const handleDelete = () => {
    deleteReference({ id: resumeId, refId: reference.id });
    setShowDelete(false);
  };

  return (
    <SortableItem id={reference.id}>
      {({ attributes, listeners, setNodeRef, style, isDragging }) => (
        <div ref={setNodeRef} style={style} className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${isDragging ? 'border-primary-400 shadow-lg scale-[1.02] z-10' : 'border-slate-200 hover:border-slate-300'}`}>
          <div className="flex items-center gap-3 p-4 bg-white cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div onClick={(e) => e.stopPropagation()} className="shrink-0"><DragHandle {...attributes} {...listeners} /></div>
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-900 font-medium truncate">{reference.name || '(Not specified)'}</h4>
              <p className="text-slate-500 text-sm truncate">
                {reference.availableUponRequest 
                  ? 'Available upon request'
                  : `${reference.designation || ''}${reference.company ? ` at ${reference.company}` : ''}`}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => setShowDelete(true)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">{isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}</button>
            </div>
          </div>
          {isExpanded && <div className="p-5 border-t border-slate-100 bg-slate-50/50"><ReferenceForm reference={reference} resumeId={resumeId} /></div>}
          <DeleteDialog isOpen={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} title="Delete Reference" description="Are you sure you want to delete this reference?" />
        </div>
      )}
    </SortableItem>
  );
};
