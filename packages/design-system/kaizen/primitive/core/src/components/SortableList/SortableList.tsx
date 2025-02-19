import React, { useState } from "react";
import { cva } from "class-variance-authority";
import Collapse from "#src/components/Collapse";
import Header, { type ListHeaderProps } from "./Header";
import DragAndDrop from "#src/components/DragAndDrop";
import Item from "./Item";
import classNames from "classnames";
import type { Sortable } from "./types";

const defaultClasses = [
  "flex",
  "min-h-2xl",
  "py-xs",
  "px-md",
  "justify-between",
  "items-center",
  "gap-xs",
  "self-stretch",
  "border-b-stroke-thin",
  "border-b-stroke-divider",
] as const;

const variants = {
  isDragging: {
    true: "",
    false: [
      "hover:bg-surface-action-default-weak-hovered",
      "active:bg-surface-action-default-weak-pressed",
    ],
  },
};

export const sortableListItem = cva(defaultClasses, { variants });

export type SortableListProps = React.HTMLAttributes<HTMLDivElement> & {
  id: string;
  isCollapsible: boolean;
  onSortChange: (items: Sortable[]) => void;
  items: Sortable[];
  header: Omit<ListHeaderProps, "isCollapseOpen" | "collapseController">;
};

/**
 * SortableList component allows for a list of items to be sorted via drag-and-drop interactions.
 * @param props - The properties for the SortableList component.
 * @param props.id - The unique identifier for the sortable list.
 * @param props.isCollapsible - Flag to indicate if the list is collapsible.
 * @param props.onSortChange - Callback function to handle the change in item order.
 * It takes the list of sorted items in param
 * @param props.items - The list of sortable items.
 * @param props.header - The header properties for the list
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-sortablelist--docs
 */
const SortableList: React.FC<SortableListProps> = ({
  className,
  header,
  isCollapsible,
  items,
  onSortChange,
  id,
  ...props
}) => {
  const [draggedItem, setDraggedItem] = useState<Sortable | null>(null);

  /**
   * Handles the drag start event.
   *
   * @param dragId - The ID of the item being dragged.
   */
  const handleDragStart = (dragId: string) => () => {
    const draggedItem = items.find(({ id }) => dragId === id);
    if (draggedItem) {
      setDraggedItem(draggedItem);
    }
  };

  /**
   * Handles the drag end event.
   */
  const handleDragEnd = () => () => {
    setDraggedItem(null);
  };

  /**
   * Handles the drop event.
   *
   * @param draggedId - The ID of the item being dragged.
   * @param dropTargetId - The ID of the drop target.
   */
  const handleDrop = (draggedId: string, dropTargetId: string) => () => {
    if (!draggedId || !dropTargetId) return;

    const draggedIndex = items.findIndex((item) => item.id === draggedId);
    /* The index of the targeted dropzone.
     * If we are dragging downward, we need to reduce the index by one otherwise it will drop below the desired position
     * To perform that we compare draggedIndex and the index of the target item.
     * If draggedIndex (the current position) is lower than the index of the target, we need to reduce the index by one.
     */
    const targetIndex =
      draggedIndex < Number(dropTargetId)
        ? Number(dropTargetId) - 1
        : Number(dropTargetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const updatedItems = [...items];
    const [movedItem] = updatedItems.splice(draggedIndex, 1); // Remove dragged item
    updatedItems.splice(targetIndex, 0, movedItem); // Insert it at the new index

    onSortChange?.(updatedItems);
  };

  return (
    <div
      className={classNames(
        {
          "outline outline-2 outline-stroke-action-main-selected": draggedItem,
        },
        className,
      )}
      {...props}
    >
      <Collapse initiallyOpen>
        <Collapse.Controller>
          {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
            const toggleOpen = () =>
              setIsCollapseOpen((prevState) => !prevState);

            return (
              <Header
                {...header}
                collapseController={isCollapsible ? toggleOpen : undefined}
                isCollapseOpen={isCollapseOpen}
                aria-expanded={isCollapseOpen}
                {...collapseProps}
              />
            );
          }}
        </Collapse.Controller>
        <Collapse.Content>
          <DragAndDrop
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            className="relative flex flex-col"
            isDnDActive
            id={id}
          >
            {items.map((item, index) => (
              <DragAndDrop.DropZone key={item.id} id={index.toString()}>
                {({ activeDropTarget }) => (
                  <>
                    {draggedItem && (
                      <Item
                        id={draggedItem.id}
                        title={draggedItem.title}
                        description={draggedItem.description}
                        rightTitle={draggedItem.rightTitle}
                        className={
                          activeDropTarget === index.toString()
                            ? "opacity-sm !border-b-stroke-regular !border-onsurface-main-strong bg-surface-default-weak"
                            : "hidden"
                        }
                      />
                    )}
                    <DragAndDrop.Item id={item.id}>
                      {({ isDragged }) => (
                        <Item
                          id={item.id}
                          title={item.title}
                          description={item.description}
                          rightTitle={item.rightTitle}
                          aria-grabbed={isDragged}
                          className={sortableListItem({
                            isDragging: !!draggedItem,
                            className: classNames("translate-x-0", {
                              hidden: isDragged,
                            }),
                          })}
                          tabIndex={0} // Allow keyboard focus
                        />
                      )}
                    </DragAndDrop.Item>
                  </>
                )}
              </DragAndDrop.DropZone>
            ))}
            <DragAndDrop.DropZone id={items.length.toString()}>
              {({ activeDropTarget }) =>
                draggedItem && (
                  <div
                    className={classNames({
                      /* Height is set as h-xl which match half of the Item min-height.
                       * Later we might need to compute this value to match half of the Item height.
                       * For example when an Item height is greater than h-2xl (the default height).
                       */
                      "absolute left-0 right-0 bottom-0 h-xl": !(
                        activeDropTarget === items.length.toString()
                      ),
                    })}
                  >
                    <Item
                      id={draggedItem.id}
                      title={draggedItem.title}
                      description={draggedItem.description}
                      rightTitle={draggedItem.rightTitle}
                      className={classNames(
                        "opacity-sm !border-b-stroke-regular !border-onsurface-main-strong bg-surface-default-weak",
                        {
                          hidden: !(
                            activeDropTarget === items.length.toString()
                          ),
                        },
                      )}
                    />
                  </div>
                )
              }
            </DragAndDrop.DropZone>
          </DragAndDrop>
        </Collapse.Content>
      </Collapse>
    </div>
  );
};

SortableList.displayName = "KaizenSortableList";

export default SortableList;
