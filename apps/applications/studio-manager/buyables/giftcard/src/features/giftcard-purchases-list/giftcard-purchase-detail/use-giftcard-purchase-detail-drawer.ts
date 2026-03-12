import { useState } from "react";

import type { GiftcardPurchase } from "../types";

export const useGiftcardPurchaseDetailDrawer = (
  giftcardPurchases: GiftcardPurchase[],
) => {
  const [selectedItem, setSelectedItem] = useState<GiftcardPurchase | null>(
    null,
  );

  const selectItem = ({ selectPrevious }: { selectPrevious?: boolean }) => {
    if (giftcardPurchases.length === 0) {
      return;
    }

    const currentIndex = giftcardPurchases.findIndex(
      (item) => item.id === selectedItem?.id,
    );

    if (currentIndex < 0) {
      // Select the first item
      setSelectedItem(giftcardPurchases[0]);
      return;
    }

    const currentLength = giftcardPurchases.length;
    const nextIndex = selectPrevious
      ? (currentIndex - 1 + currentLength) % currentLength
      : (currentIndex + 1) % currentLength;

    setSelectedItem(giftcardPurchases[nextIndex]);
  };

  const selectPreviousItem = () => selectItem({ selectPrevious: true });

  const selectNextItem = () => selectItem({ selectPrevious: false });

  const closeDrawer = () => setSelectedItem(null);

  const onItemClick = (value: GiftcardPurchase) => {
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
