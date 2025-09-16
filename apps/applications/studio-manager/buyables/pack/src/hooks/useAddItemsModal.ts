import { useCallback, useState } from "react";

import type { ItemVariant } from "#src/utils/constants";

export const useAddItemsModal = () => {
  const [selectedVariant, setSelectedVariant] = useState<ItemVariant | null>(
    null,
  );

  const handleClose = useCallback(() => {
    setSelectedVariant(null);
  }, []);

  return {
    selectedVariant,
    setSelectedVariant,
    isAddItemsModalOpen: !!selectedVariant,
    closeAddItemsModal: handleClose,
  };
};
