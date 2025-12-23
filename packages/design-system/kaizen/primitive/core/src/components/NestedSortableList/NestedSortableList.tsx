import { cx } from "class-variance-authority";
import React, { useState } from "react";

import { sortItemInList } from "#src/utils/sortable";

import DragAndDrop from "../DragAndDrop";
import SortableList, { Sortable, SortableListProps } from "../SortableList";

const DRAGGED_ITEM_CLASSNAME =
  "opacity-sm border-b-stroke-regular border-onsurface-main-strong bg-surface-default-weak";

type Props = {
  id: string;
  sortableLists: SortableListProps[];
  onSortChildren: ({
    reorderedChildren,
    parentListId,
  }: {
    reorderedChildren: Sortable[];
    parentListId: string;
  }) => void;
  onSortParents: (reorderedParents: SortableListProps[]) => void;
};

export type NestedSortableListProps = React.HTMLAttributes<HTMLDivElement> &
  Props;

/**
 * NestedSortableList component allows for a list of lists of items to be sorted via drag-and-drop interactions and sort also the parent lists themselves.
 * @param props - The properties for the NestedSortableList component.
 * @param props.id - The unique identifier for the nested  sortable list.
 * @param props.sortableLists - object to pass the list of lists to use and display in the component.
 * @param props.onSortParent - function to use when a modification has been made in the ordering of the parent list to get the changes.
 * @param props.onSortChildren - function to use when a modification has been made in the ordering of a child list to get the changes.
 * @link https://docs.infra.bsport.io/storybook/kaizen/main/index.html?path=/docs/components-nestedsortablelist--docs
 */
const NestedSortableList: React.FC<NestedSortableListProps> = ({
  id,
  onSortChildren,
  onSortParents,
  sortableLists,
}) => {
  const [sortableListData, setSortableListData] =
    useState<SortableListProps[]>(sortableLists);
  const [draggedSortableList, setDraggedSortableList] =
    useState<SortableListProps | null>(null);
  const divRef = React.createRef<HTMLDivElement>();

  const handleSortChange = (listId: string) => (updatedItems: Sortable[]) => {
    onSortChildren({ reorderedChildren: updatedItems, parentListId: listId });
    setSortableListData((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, items: updatedItems } : list,
      ),
    );
  };

  const handleDragStart = (dragId: string) => () => {
    // HACK: Using setTimeout to work around a browser issue where dragend
    // fires immediately after dragstart in certain conditions. This appears
    // to be related to how React's synthetic events interact with native
    // drag events. This is a known issue in the HTML5 drag and drop API.
    // Reference: https://stackoverflow.com/questions/19639969/html5-dragend-event-firing-immediately
    setTimeout(() => {
      // When dragging, all lists are collapsed, changing the vertical position of the dragged item (sortable list)
      // Because we need to scroll to this new position (which is the total number of viewable items in the window
      // added to the top position of the drop zone so that you can directly go to the top of the whole DragAndDrop list),
      const element = document.getElementById(id);
      element?.scrollIntoView({
        behavior: "smooth",
      });
      // Find the dragged list by its ID and set it as the draggedSortableList
      const draggedList = sortableListData.find(({ id }) => dragId === id);
      if (draggedList) {
        setDraggedSortableList(draggedList);
      }
    }, 0);
  };

  const handleDragEnd = () => () => {
    setDraggedSortableList(null);
  };

  const handleDrop = (draggedId: string, dropTargetIndex: string) => () => {
    if (!draggedId || !dropTargetIndex) return;

    setSortableListData((prevData) => {
      const updatedList = sortItemInList<SortableListProps>({
        itemsList: prevData,
        sourceId: draggedId,
        targetIndex: dropTargetIndex,
      });
      onSortParents(updatedList);
      return updatedList;
    });
  };

  return (
    <div data-component="Kaizen-NestedSortableList" ref={divRef}>
      <DragAndDrop
        id={id}
        onDrop={handleDrop}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        className={cx("relative flex flex-col", {
          "border-stroke-regular border-onsurface-main-weak":
            !!draggedSortableList,
        })}
        isDnDActive
      >
        {sortableListData &&
          sortableListData.map((list, index) => (
            <DragAndDrop.DropZone key={list.id} id={index.toString()}>
              {({ activeDropTarget }) => (
                <>
                  {draggedSortableList && (
                    <SortableList
                      header={draggedSortableList.header}
                      id={draggedSortableList.id}
                      items={draggedSortableList.items}
                      onSortChange={handleSortChange(draggedSortableList.id)}
                      hideListContent={!!draggedSortableList}
                      emptyStateProps={draggedSortableList.emptyStateProps}
                      isDraggable={true}
                      collapsibleProps={
                        draggedSortableList.collapsibleProps ?? {
                          initiallyOpen: true,
                        }
                      }
                      className={
                        activeDropTarget === index.toString()
                          ? DRAGGED_ITEM_CLASSNAME
                          : "hidden"
                      }
                    />
                  )}
                  <DragAndDrop.Item id={list.id}>
                    {({ isDragged }) => (
                      <SortableList
                        header={list.header}
                        id={list.id}
                        items={list.items}
                        onSortChange={handleSortChange(list.id)}
                        className={cx("translate-x-0", {
                          hidden: isDragged,
                        })}
                        hideListContent={!!draggedSortableList}
                        emptyStateProps={list.emptyStateProps}
                        collapsibleProps={
                          list.collapsibleProps ?? {
                            initiallyOpen: true,
                          }
                        }
                        isDraggable={true}
                        tabIndex={0}
                      />
                    )}
                  </DragAndDrop.Item>
                </>
              )}
            </DragAndDrop.DropZone>
          ))}
        <DragAndDrop.DropZone id={sortableListData?.length?.toString()}>
          {({ activeDropTarget }) =>
            draggedSortableList && (
              <div
                className={cx({
                  "absolute left-0 right-0 bottom-0 h-xl": !(
                    activeDropTarget === sortableListData?.length?.toString()
                  ),
                })}
              >
                <SortableList
                  header={draggedSortableList.header}
                  id={draggedSortableList.id}
                  items={draggedSortableList.items}
                  onSortChange={handleSortChange(draggedSortableList.id)}
                  emptyStateProps={draggedSortableList.emptyStateProps}
                  hideListContent={draggedSortableList ? true : undefined}
                  className={cx(DRAGGED_ITEM_CLASSNAME, {
                    hidden: !(
                      activeDropTarget === sortableListData?.length?.toString()
                    ),
                  })}
                />
              </div>
            )
          }
        </DragAndDrop.DropZone>
      </DragAndDrop>
    </div>
  );
};

NestedSortableList.displayName = "KaizenNestedSortableList";

export default NestedSortableList;
