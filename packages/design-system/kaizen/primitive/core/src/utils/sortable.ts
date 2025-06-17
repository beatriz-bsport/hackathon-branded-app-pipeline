/**
 * Reorders items in a list by moving an item from source position to target position.
 * Handles the index adjustment needed when dragging items downward in the list.
 *
 * @template T - Type of items in the list, must have an 'id' property
 * @param itemsList - Array of items to reorder
 * @param sourceId - ID of the item being moved
 * @param targetIndex - Target position index where the item should be moved
 * @returns New array with the item moved to the target position, or original array if operation is invalid
 */
export function sortItemInList<T extends { id: string }>({
  itemsList,
  sourceId,
  targetIndex,
}: {
  itemsList: T[];
  sourceId: string;
  targetIndex: string;
}) {
  const draggedIndex = itemsList.findIndex((list) => list.id === sourceId);

  /* The index of the targeted dropzone.
   * If we are dragging downward, we need to reduce the index by one otherwise it will drop below the desired position
   * To perform that we compare draggedIndex and the index of the target item.
   * If draggedIndex (the current position) is lower than the index of the target, we need to reduce the index by one.
   */
  const parsedTargetIndex =
    draggedIndex < Number(targetIndex)
      ? Number(targetIndex) - 1
      : Number(targetIndex);

  if (draggedIndex === -1 || parsedTargetIndex === -1) return itemsList;

  const updatedLists = [...itemsList];
  const [movedList] = updatedLists.splice(draggedIndex, 1); // Remove dragged item
  updatedLists.splice(parsedTargetIndex, 0, movedList); // Insert it at the new index

  return updatedLists;
}
