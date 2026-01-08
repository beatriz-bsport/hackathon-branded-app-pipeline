import classNames from "classnames";
import React, {
  DragEvent,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";

import DropZone from "./DropZone";
import Item from "./Item";

export const DragAndDropContext = createContext<{
  isDnDActive: boolean;

  // Draggable
  onDrag?: (id: string) => (event: DragEvent) => void;
  onDragEnd?: (id: string) => (event: DragEvent) => void;
  onDragStart?: (id: string) => (event: DragEvent) => void;
  draggedId: string | null;
  setDraggedId: React.Dispatch<React.SetStateAction<string | null>>;

  // DropTarget
  isDropAllowed?: (
    draggedId: string | null,
    droppedTargetId: string | null,
  ) => boolean;
  onDragEnter?: (id: string) => (event: DragEvent) => void;
  onDragLeave?: (id: string) => (event: DragEvent) => void;
  onDragOver?: (id: string) => (event: DragEvent) => void;
  onDrop: (
    draggedId: string,
    dropTargetId: string,
  ) => (event?: DragEvent) => void;
  dropTargetId: string | null;
  setDropTargetId: React.Dispatch<React.SetStateAction<string | null>>;
}>({
  isDnDActive: true,
  onDrop: () => () => {},
  // Draggable
  onDrag: () => () => {},
  onDragEnd: () => () => {},
  onDragStart: () => () => {},
  draggedId: null,
  setDraggedId: () => {},
  // Drop Target
  isDropAllowed: () => true,
  onDragEnter: () => () => {},
  onDragLeave: () => () => {},
  onDragOver: () => () => {},
  dropTargetId: null,
  setDropTargetId: () => {},
});

export const useDragAndDrop = () => {
  return useContext(DragAndDropContext);
};

export type DragAndDropProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  | "onDrag"
  | "onDragEnd"
  | "onDragEnter"
  | "onDragLeave"
  | "onDragOver"
  | "onDragStart"
  | "onDrop"
> & {
  children: ReactNode;
  isDnDActive?: boolean;
  isDropAllowed?: (
    draggedId: string | null,
    droppedTargetId: string | null,
  ) => boolean;
  onDrag?: (id: string) => (event: DragEvent) => void;
  onDragEnd?: (id: string) => (event: DragEvent) => void;
  onDragEnter?: (id: string) => (event: DragEvent) => void;
  onDragLeave?: (id: string) => (event: DragEvent) => void;
  onDragOver?: (id: string) => (event: DragEvent) => void;
  onDragStart?: (id: string) => (event: DragEvent) => void;
  onDrop: (
    draggedId: string,
    dropTargetId: string,
  ) => (event?: DragEvent) => void;
};

/**
 * DragAndDrop is a generic component that provides a context and event handlers for implementing
 * drag-and-drop interactions. It manages the state of draggable elements and droppable targets,
 * facilitating complex drag-and-drop UIs.
 *
 * - **Draggable Element State**:
 *   - `isDragged`: Tracks whether an element is currently being dragged.
 *   - Dragged element remains visible and placeholder behavior can be customized.
 * - **Droppable Target State**:
 *   - `isHovered`: Indicates whether a dragged element is currently hovering over the target.
 *   - `isValidDropTarget`: Indicates if a dragged element can be dropped on a target.
 *
 * @param props.isDnDActive - Enables or disables the drag-and-drop context.
 * @param props.children - Components to be rendered inside the drag-and-drop context.
 * @param props.isDropAllowed
 *   - Optional validation function to determine if a dragged element can be dropped on a target.
 * @param props.onDrag
 *   - Callback fired repeatedly during dragging. Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drag_event
 * @param props.onDragEnd
 *   - Callback fired when dragging ends (drop or cancel). Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event
 * @param props.onDragEnter
 *   - Callback fired when a draggable enters a drop target. Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event
 * @param props.onDragLeave
 *   - Callback fired when a draggable leaves a drop target. Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragleave_event
 * @param props.onDragOver
 *   - Callback fired repeatedly as a draggable hovers over a drop target.Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event
 * @param props.onDragStart
 *   - Callback fired when dragging starts. Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event
 * @param props.onDrop
 *   - Callback fired when a draggable is dropped onto a valid drop target. Check https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/drop_event
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-draganddrop--docs
 */
const DragAndDrop: React.FC<DragAndDropProps> & {
  Item: typeof Item;
  DropZone: typeof DropZone;
} = ({
  className,
  children,
  isDnDActive = true,
  isDropAllowed,
  onDrag,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDragStart,
  onDrop,
  ...props
}: DragAndDropProps) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const [dropTargetId, setDropTargetId] = useState<string | null>(null);

  return (
    <DragAndDropContext.Provider
      value={{
        draggedId,
        dropTargetId,
        onDrop,
        isDnDActive,
        isDropAllowed,
        onDrag,
        onDragEnd,
        onDragEnter,
        onDragLeave,
        onDragOver,
        onDragStart,
        setDraggedId,
        setDropTargetId,
      }}
    >
      <div
        data-component="Kaizen-DragAndDrop"
        className={classNames(className)}
        {...props}
      >
        {children}
      </div>
    </DragAndDropContext.Provider>
  );
};

DragAndDrop.Item = Item;
DragAndDrop.DropZone = DropZone;

export default DragAndDrop;
