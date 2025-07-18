import React, { DragEvent, ReactNode, useState } from 'react';

import { useDragAndDrop } from './DragAndDrop';

const Item: React.FC<
  {
    id: string;
    children: (props: { isDragged: boolean }) => ReactNode;
    className?: string;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
> = ({ id, children, className, ...props }) => {
  const {
    draggedId,
    isDnDActive,
    onDrag,
    onDragEnd,
    onDragStart,
    setDraggedId,
    setDropTargetId,
  } = useDragAndDrop();

  const [isDragged, setIsDragged] = useState(false);

  // Draggable events related callbacks
  const handleDragStart = (event: DragEvent) => {
    event.stopPropagation();
    event.dataTransfer.effectAllowed = 'move';
    setDraggedId(event.currentTarget.id);
    onDragStart?.(event.currentTarget.id)(event);
  };

  const handleDrag = (event: DragEvent) => {
    event.stopPropagation();
    setIsDragged(draggedId === event.currentTarget.id);
    if (draggedId) {
      onDrag?.(draggedId)(event);
    }
  };

  const handleDragEnd = (event: DragEvent) => {
    event.stopPropagation();
    if (draggedId) {
      onDragEnd?.(draggedId!)(event);
    }
    setDraggedId(null);
    setIsDragged(false);
    setDropTargetId(null);
  };

  return (
    <div
      className={className}
      draggable={isDnDActive}
      id={id}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      {...props}
    >
      {children({ isDragged })}
    </div>
  );
};

export default Item;
