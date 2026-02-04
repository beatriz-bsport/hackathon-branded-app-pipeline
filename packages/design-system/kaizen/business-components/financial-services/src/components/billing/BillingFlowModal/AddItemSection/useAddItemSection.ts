import { useCallback, useMemo } from "react";

import { useFormContext } from "@bsport/form";

import { ADD_ITEM_DEFAULT } from "#src/components/billing/BillingFlowModal/defaults";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import type { InvoiceItemFormData } from "#src/components/billing/BillingFlowModal/types";
import type { ItemAutocompleteItem } from "#src/components/billing/ItemAutocomplete";

type Options = {
  selectedItem?: ItemAutocompleteItem;
};

type Return = {
  itemToAdd: InvoiceItemFormData | null;
  handleAddItem: () => void;
  resetAddItemFields: (options?: { keepItemType?: boolean }) => void;
  handleClear: () => void;
};

export const useAddItemSection = ({ selectedItem }: Options): Return => {
  const { watch, setValue, reset, getValues } =
    useFormContext<BillingFlowFormState>();

  const selectedItemType = watch("addItemSelectedItemType");
  const selectedItemId = watch("addItemSelectedItemId");
  const quantity = watch("addItemQuantity");
  const priceCts = watch("addItemPriceCts");

  const resetAddItemFields = useCallback(
    (options?: { keepItemType?: boolean }) => {
      const { keepItemType = false } = options ?? {};
      const current = getValues();
      const addItemDefaults = { ...ADD_ITEM_DEFAULT };

      if (keepItemType) {
        (addItemDefaults as BillingFlowFormState).addItemSelectedItemType =
          current.addItemSelectedItemType;
      }

      reset({ ...current, ...addItemDefaults });
    },
    [getValues, reset],
  );

  const handleClear = useCallback(() => {
    resetAddItemFields({ keepItemType: true });
  }, [resetAddItemFields]);

  const itemToAdd = useMemo<InvoiceItemFormData | null>(() => {
    const price = priceCts ?? 0;
    if (!selectedItemId?.trim() || selectedItemType == null || price < 0) {
      return null;
    }

    const quantityFieldShown = selectedItemType !== "giftcard";
    const quantityForItem = quantityFieldShown ? Math.max(1, quantity) : 1;
    if (quantityFieldShown && quantity < 1) return null;

    const discountPercent = watch("addItemDiscountPercent");
    const discountAmountCts = watch("addItemDiscountAmountCts");

    return {
      type: selectedItemType,
      buyableItemId: Number(selectedItemId),
      quantity: quantityForItem,
      priceCts: price,
      discountPercent,
      discountAmountCts,
      activationDate: null,
      billingDetail: null,
      itemName: selectedItem?.title ?? "",
      taxPercent: selectedItem?.taxPercent,
      credits: selectedItem?.credits ?? null,
      durationDays: selectedItem?.durationDays ?? null,
      durationMonths: selectedItem?.durationMonths ?? null,
      durationYears: selectedItem?.durationYears ?? null,
      validityDateRange: selectedItem?.validityDateRange ?? null,
    };
  }, [
    priceCts,
    quantity,
    selectedItem,
    selectedItemId,
    selectedItemType,
    watch,
  ]);

  const handleAddItem = useCallback(() => {
    if (!itemToAdd) return;

    const currentItems = watch("items");

    setValue(
      "items",
      [...currentItems, itemToAdd as BillingFlowFormState["items"][number]],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );

    resetAddItemFields({ keepItemType: false });
    setValue("addItemSelectedItemType", null, { shouldDirty: true });
  }, [itemToAdd, resetAddItemFields, setValue, watch]);

  return {
    itemToAdd,
    handleAddItem,
    resetAddItemFields,
    handleClear,
  };
};
