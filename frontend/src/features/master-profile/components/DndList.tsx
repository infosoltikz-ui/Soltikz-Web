import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

interface DndListProps {
  items: Array<{ id: string }>;
  onDragEnd: (event: DragEndEvent) => void;
  children: React.ReactNode;
}

export const DndList: React.FC<DndListProps> = ({ items, onDragEnd, children }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Requires a 5px drag to initiate (allows clicking on the handle)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Filter out any items without a valid ID just in case
  const itemIds = items.map(item => item.id).filter(Boolean);

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <SortableContext 
        items={itemIds}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {children}
        </div>
      </SortableContext>
    </DndContext>
  );
};
