import clsx from "clsx";
import { useState } from "react";

import {
  DragAndDrop,
  type Sortable,
  SortableList,
  type SortableListProps,
} from "@bsport/kaizen-primitive-core";

type Props = {
  onSortChildren: (reorderedChildren: Sortable[]) => void;
  onSortParents: (reorderedParents: SortableListProps[]) => void;
  sortableLists: SortableListProps[];
};

export const NestedSortableList: React.FC<Props> = ({
  onSortChildren,
  onSortParents,
  sortableLists,
}: Props) => {
  const [sortableListData, setSortableListData] =
    useState<SortableListProps[]>(sortableLists);
  const [draggedSortableList, setDraggedSortableList] =
    useState<SortableListProps | null>(null);
  const [shouldListsBeExpanded, setShouldListsBeExpanded] =
    useState<boolean>(true);

  const handleSortChange = (listId: string) => (updatedItems: Sortable[]) => {
    onSortChildren(updatedItems);
    setSortableListData((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, items: updatedItems } : list,
      ),
    );
  };

  const handleDragStart = (dragId: string) => () => {
    const draggedList = sortableListData.find(({ id }) => dragId === id);
    if (draggedList) {
      setDraggedSortableList(draggedList);
      setShouldListsBeExpanded(false);
    }
  };

  const handleDragEnd = () => () => {
    setDraggedSortableList(null);
    setShouldListsBeExpanded(true);
  };

  const handleDrop = (draggedId: string, dropTargetId: string) => () => {
    if (!draggedId || !dropTargetId) return;

    setSortableListData((prevData) => {
      const draggedIndex = prevData.findIndex((list) => list.id === draggedId);
      const targetIndex = parseInt(dropTargetId, 10); // because dropTargetId gives us the index of the element where it is dropped and not the id
      if (
        draggedIndex === -1 ||
        (!targetIndex && typeof targetIndex !== "number")
      )
        return prevData;
      const updatedLists = [...prevData];
      const [movedList] = updatedLists.splice(draggedIndex, 1);
      updatedLists.splice(targetIndex, 0, movedList);
      onSortParents(updatedLists);
      return updatedLists;
    });
  };

  return (
    <DragAndDrop
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      className="relative flex flex-col"
      isDnDActive
      id="sortable-list-dnd"
    >
      {sortableListData &&
        Array.isArray(sortableListData) &&
        sortableListData.map((list, index) => (
          <DragAndDrop.DropZone key={list.id} id={index?.toString()}>
            {({ activeDropTarget }) => (
              <>
                {draggedSortableList && (
                  <SortableList
                    header={draggedSortableList.header}
                    id={draggedSortableList.id}
                    items={draggedSortableList.items}
                    onSortChange={handleSortChange(draggedSortableList.id)}
                    collapsibleProps={
                      shouldListsBeExpanded
                        ? {
                            initiallyOpen: true,
                          }
                        : undefined
                    }
                    className={
                      activeDropTarget === index?.toString()
                        ? "opacity-sm !border-b-stroke-regular !border-onsurface-main-strong bg-surface-default-weak "
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
                      collapsibleProps={
                        shouldListsBeExpanded
                          ? {
                              initiallyOpen: true,
                            }
                          : undefined
                      }
                      className={clsx("translate-x-0", {
                        hidden: isDragged,
                      })}
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
              className={clsx({
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
                className={clsx(
                  "opacity-sm !border-b-stroke-regular !border-onsurface-main-strong bg-surface-default-weak",
                  {
                    hidden: !(
                      activeDropTarget === sortableListData?.length?.toString()
                    ),
                  },
                )}
              />
            </div>
          )
        }
      </DragAndDrop.DropZone>
    </DragAndDrop>
  );
};
