import React, { DragEvent, ReactNode, useState } from 'react';

import { useDragAndDrop } from './DragAndDrop';

/**
 * DropZone component represents a single drop target within the DragAndDrop context.
 * @param id - Unique identifier for the drop zone.
 * @param className - Additional class names to apply to the component.
 * @param children - The children elements to be rendered inside the drop zones.
 * @param split - The direction to split the drop zones, either "horizontal" or "vertical".
 */
const DropZone: React.FC<
  {
    children: (props: {
      isHovered: boolean;
      isValidDropTarget: boolean;
      activeDropTarget: string | null;
    }) => ReactNode;
    className?: string;
    id: string;
  } & Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>
> = ({ children, className, id, ...props }) => {
  const {
    draggedId,
    dropTargetId,
    onDrop,
    isDropAllowed,
    onDragEnter,
    onDragLeave,
    onDragOver,
    setDropTargetId,
    setDraggedId,
  } = useDragAndDrop();

  const [isHovered, setIsHovered] = useState(false);

  const [isValidDropTarget, setIsValidDropTarget] = useState(true);

  // DropTarget events
  const handleDragEnter = (event: DragEvent) => {
    event.stopPropagation();
    setDropTargetId(event.currentTarget.id);
    onDragEnter?.(event.currentTarget.id)(event);
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsHovered(dropTargetId === event.currentTarget.id);
    if (isDropAllowed)
      setIsValidDropTarget(isDropAllowed(draggedId, event.currentTarget.id));
    onDragOver?.(event.currentTarget.id)(event);
  };

  const handleDragLeave = (event: DragEvent) => {
    event.stopPropagation();
    onDragLeave?.(event.currentTarget.id)(event);
    setIsHovered(false);
    if (isDropAllowed) setIsValidDropTarget(false);
  };

  const handleDrop = (event: DragEvent) => {
    event.preventDefault();
    if (isValidDropTarget && dropTargetId && draggedId) {
      onDrop?.(draggedId, dropTargetId)(event);
    }
    setIsHovered(false);
    if (isDropAllowed) setIsValidDropTarget(false);
    setDraggedId(null);
    setDropTargetId(null);
  };

  return (
    <div
      id={id}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      {...props}
    >
      {children({
        isHovered,
        isValidDropTarget,
        activeDropTarget: dropTargetId,
      })}
    </div>
  );
};

export default React.memo(DropZone);
