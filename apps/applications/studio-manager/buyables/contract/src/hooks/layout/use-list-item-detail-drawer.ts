import { useState } from "react";

export type ListItemDetailDrawerProps<T extends { id: string | number }> = {
  isOpen: boolean;
  selectedItem: T | null;
  closeDrawer: () => void;
  selectNextItem: () => void;
  selectPreviousItem: () => void;
};

export const useListItemDetailDrawer = <T extends { id: string | number }>(
  listItems: T[],
) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(null);

  const selectItem = ({ selectPrevious }: { selectPrevious?: boolean }) => {
    if (listItems.length === 0) {
      return;
    }

    const currentIndex = listItems.findIndex(
      (item) => item.id === selectedItem?.id,
    );

    if (currentIndex < 0) {
      // Select the first item
      setSelectedItem(listItems[0]);
      return;
    }

    const currentLength = listItems.length;
    const nextIndex = selectPrevious
      ? (currentIndex - 1 + currentLength) % currentLength
      : (currentIndex + 1) % currentLength;

    setSelectedItem(listItems[nextIndex]);
  };

  const selectPreviousItem = () => selectItem({ selectPrevious: true });

  const selectNextItem = () => selectItem({ selectPrevious: false });

  const closeDrawer = () => setSelectedItem(null);

  const onItemClick = (value: T) => {
    setSelectedItem((prev) => (prev?.id === value.id ? null : value));
  };

  return {
    isOpen: !!selectedItem,
    selectedItem,
    closeDrawer,
    onItemClick,
    selectPreviousItem,
    selectNextItem,
  };
};
