function handleSelectSingleOrMultipleItems<T>({
  onSelectItems,
  selectedItems,
  itemsById,
}: {
  onSelectItems?: (selectedItems: T[]) => void;
  selectedItems?: string | string[];
  itemsById: Record<number, T>;
}) {
  if (!onSelectItems || !selectedItems) {
    return;
  }
  const isSelectedValuesArray = Array.isArray(selectedItems);
  const isSelectedValuesString = typeof selectedItems === "string";
  if (isSelectedValuesArray) {
    const passArray: T[] = [];
    selectedItems.forEach((passId) => {
      const parsedPassId = parseInt(passId);
      if (!isNaN(parsedPassId)) {
        passArray.push(itemsById[parsedPassId]);
      }
    });
    onSelectItems(passArray || []);
  }
  if (isSelectedValuesString) {
    const passArray: T[] = [];
    const parsedPassId = parseInt(selectedItems);
    if (!isNaN(parsedPassId)) {
      passArray.push(itemsById[parsedPassId]);
    }
    onSelectItems(passArray || []);
  }
}

export { handleSelectSingleOrMultipleItems };
