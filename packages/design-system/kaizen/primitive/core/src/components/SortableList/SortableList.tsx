import { cva } from "class-variance-authority";
import classNames from "classnames";
import React, { useState } from "react";

import Collapse, { type CollapseProps } from "#src/components/Collapse";
import DragAndDrop from "#src/components/DragAndDrop";
import type { UseEmptyStateProps } from "#src/hooks";
import useEmptyState from "#src/hooks/use-empty-state.hook";
import {
  UseLoadingStateProps,
  useLoadingState,
} from "#src/hooks/use-loading-state";

import Header, { type ListHeaderProps } from "./Header";
import Item from "./Item";
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
  collapsibleProps?: Omit<CollapseProps, "children">;
  header: Omit<ListHeaderProps, "isCollapseOpen" | "collapseController">;
  loadingProps?: UseLoadingStateProps;
} & Omit<SortableListContentProps, "draggedItem" | "setDraggedItem">;

type SortableListContentProps = {
  items: Sortable[];
  draggedItem: Sortable | null;
  setDraggedItem: React.Dispatch<React.SetStateAction<Sortable | null>>;
  onSortChange: (items: Sortable[]) => void;
  emptyStateProps?: UseEmptyStateProps;
  id: string;
};

/**
 * SortableList component allows for a list of items to be sorted via drag-and-drop interactions.
 * @param props - The properties for the SortableList component.
 * @param props.id - The unique identifier for the sortable list.
 * @param props.collapsibleProps - object to pass config of the Collapse component
 * @param props.onSortChange - Callback function to handle the change in item order.
 * It takes the list of sorted items in param
 * @param props.items - The list of sortable items.
 * @param props.header - The header properties for the list
 *  * @param loadingProps [Optional] Dictionnary of props to manage the loading state rendering
 * - message [Optional] string of the loading message to display;
 * - className [Optional] string, tailwind css classes to add to the loading component;
 * - isLoading [Optional] Whether the fetch return a loading list;
 * @param emptyStateProps [Optional] Dictionnary of props to manage the empty state rendering
 * - emptyConfig Configuration to display the empty state UI when isEmpty is true;
 * - emptySearchConfig [Optional] Configuration to display the empty search UI when isEmptySearch is true;
 * - isEmpty Whether the fetch return an empty list;
 * - isEmptySearch [Optional] Whether the filtering return an empty list;
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-sortablelist--docs
 */
const SortableList: React.FC<SortableListProps> = ({
  className,
  header,
  collapsibleProps,
  emptyStateProps,
  loadingProps,
  items,
  onSortChange,
  id,
  ...props
}) => {
  const { shouldRenderLoadingState, LoadingState } =
    useLoadingState(loadingProps);

  const [draggedItem, setDraggedItem] = useState<Sortable | null>(null);

  if (shouldRenderLoadingState) return <LoadingState />;

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
      <Collapse initiallyOpen={collapsibleProps?.initiallyOpen}>
        <Collapse.Controller>
          {({ collapseProps, setIsCollapseOpen, isCollapseOpen }) => {
            const toggleOpen = () =>
              setIsCollapseOpen((prevState) => !prevState);

            return (
              <Header
                {...header}
                collapseController={collapsibleProps ? toggleOpen : undefined}
                isCollapseOpen={isCollapseOpen}
                aria-expanded={isCollapseOpen}
                {...collapseProps}
              />
            );
          }}
        </Collapse.Controller>
        <Collapse.Content>
          <SortableListContent
            emptyStateProps={emptyStateProps}
            id={id}
            items={items}
            draggedItem={draggedItem}
            setDraggedItem={setDraggedItem}
            onSortChange={onSortChange}
          />
        </Collapse.Content>
      </Collapse>
    </div>
  );
};

const SortableListContent: React.FC<SortableListContentProps> = ({
  emptyStateProps,
  id,
  items,
  draggedItem,
  setDraggedItem,
  onSortChange,
}: SortableListContentProps) => {
  const { shouldRenderEmptyState, EmptyState } = useEmptyState(emptyStateProps);

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

  if (shouldRenderEmptyState) {
    return <EmptyState />;
  }

  return (
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
                  buttons={draggedItem.buttons}
                  dropdownConfig={draggedItem.dropdownConfig}
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
                    buttons={item.buttons}
                    dropdownConfig={item.dropdownConfig}
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
                    hidden: !(activeDropTarget === items.length.toString()),
                  },
                )}
                buttons={draggedItem.buttons}
                dropdownConfig={draggedItem.dropdownConfig}
              />
            </div>
          )
        }
      </DragAndDrop.DropZone>
    </DragAndDrop>
  );
};

SortableList.displayName = "KaizenSortableList";

export default SortableList;
