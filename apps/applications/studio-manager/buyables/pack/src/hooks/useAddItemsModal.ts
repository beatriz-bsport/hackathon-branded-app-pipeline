import { useCallback, useState } from "react";

export const ITEM_VARIANTS = {
  pass: "pass",
  appointmentPass: "appointmentPass",
  webshopItem: "webshopItem",
} as const;

export type ItemVariant = keyof typeof ITEM_VARIANTS;

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
