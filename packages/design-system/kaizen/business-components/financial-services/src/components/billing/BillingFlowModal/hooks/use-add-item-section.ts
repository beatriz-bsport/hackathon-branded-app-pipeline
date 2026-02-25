import { useCallback, useMemo } from "react";

import { useFormContext } from "@bsport/form";

import {
  ADD_ITEM_DEFAULT,
  ADD_ITEM_DEFAULT_KEYS,
  GIFTCARD_DEFAULT_KEYS,
  GIFTCARD_FIELDS_DEFAULT,
} from "#src/components/billing/BillingFlowModal/defaults";
import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import type { BillingFlowItem } from "#src/components/billing/BillingFlowModal/types";
import type { ItemAutocompleteItem } from "#src/components/billing/ItemAutocomplete";

type Options = {
  selectedItem?: ItemAutocompleteItem;
};

type Return = {
  itemToAdd: BillingFlowItem | null;
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
  const applyDiscount = watch("addItemApplyDiscount");
  const discountReason = watch("addItemDiscountReason");
  const isDiscountReasonRequired = watch("isDiscountReasonRequired");
  const giftcardRecipientName = watch("addItemGiftcardRecipientName");
  const giftcardFrom = watch("addItemGiftcardFrom");
  const giftcardTo = watch("addItemGiftcardTo");
  const giftcardValidFrom = watch("addItemGiftcardValidFrom");
  const giftcardDeliveryFormat = watch("addItemGiftcardDeliveryFormat");
  const giftcardRecipientEmails = watch("addItemGiftcardRecipientEmails");

  /**
   * Resets only add-item (and giftcard) fields via setValue.
   * Use this after adding an item so we don't call reset()
   * (which would overwrite `items` and clear `isDirty`).
   */
  const applyAddItemDefaults = useCallback(
    (options?: { keepItemType?: boolean }) => {
      const { keepItemType = false } = options ?? {};
      const addItemDefaults: Pick<
        BillingFlowFormState,
        keyof typeof ADD_ITEM_DEFAULT
      > = { ...ADD_ITEM_DEFAULT };
      if (keepItemType) {
        const current = getValues();
        addItemDefaults.addItemSelectedItemType =
          current.addItemSelectedItemType;
      } else {
        addItemDefaults.addItemSelectedItemType = null;
      }
      ADD_ITEM_DEFAULT_KEYS.forEach((key) =>
        setValue(key, addItemDefaults[key], { shouldValidate: true }),
      );
      GIFTCARD_DEFAULT_KEYS.forEach((key) =>
        setValue(key, GIFTCARD_FIELDS_DEFAULT[key], { shouldValidate: true }),
      );
    },
    [getValues, setValue],
  );

  const resetAddItemFields = useCallback(
    (options?: { keepItemType?: boolean }) => {
      const { keepItemType = false } = options ?? {};
      const current = getValues();
      const addItemDefaults: Pick<
        BillingFlowFormState,
        keyof typeof ADD_ITEM_DEFAULT
      > = { ...ADD_ITEM_DEFAULT };

      if (keepItemType) {
        addItemDefaults.addItemSelectedItemType =
          current.addItemSelectedItemType;
      }

      reset({
        ...current,
        ...addItemDefaults,
      });
    },
    [getValues, reset],
  );

  const handleClear = useCallback(() => {
    resetAddItemFields({ keepItemType: true });
  }, [resetAddItemFields]);

  const itemToAdd = useMemo<BillingFlowItem | null>(() => {
    const price = priceCts ?? 0;
    if (!selectedItemId?.trim() || selectedItemType == null || price < 0) {
      return null;
    }

    const quantityFieldShown = selectedItemType !== "giftcard";
    const quantityForItem = quantityFieldShown ? Math.max(1, quantity) : 1;
    if (quantityFieldShown && quantity < 1) return null;

    const discountPercent = watch("addItemDiscountPercent");
    const discountAmountCts = watch("addItemDiscountAmountCts");

    const isDiscountApplied =
      applyDiscount && (discountPercent > 0 || discountAmountCts > 0);
    if (
      isDiscountApplied &&
      isDiscountReasonRequired &&
      !discountReason.trim()
    ) {
      return null;
    }

    if (selectedItemType === "giftcard") {
      if (
        !giftcardRecipientName?.trim() ||
        !giftcardFrom?.trim() ||
        !giftcardTo?.trim()
      )
        return null;

      // PDF delivery requires validFrom
      if (giftcardDeliveryFormat === "pdf" && !giftcardValidFrom?.trim())
        return null;

      // Email delivery requires recipient emails
      if (
        giftcardDeliveryFormat === "email" &&
        giftcardRecipientEmails.length === 0
      )
        return null;
    }

    const baseItem = {
      type: selectedItemType,
      buyableItemId: Number(selectedItemId),
      quantity: quantityForItem,
      priceCts: price,
      discountPercent,
      discountAmountCts,
      discountReason: discountReason.trim(),
      activationDate: null,
      billingDetail: null,
      itemName: selectedItem?.title ?? "",
      taxPercent: selectedItem?.taxPercent,
      credits: selectedItem?.credits ?? null,
      durationDays: selectedItem?.durationDays ?? null,
      durationMonths: selectedItem?.durationMonths ?? null,
      durationYears: selectedItem?.durationYears ?? null,
      validityDateRange: selectedItem?.validityDateRange ?? null,
      expirationDays: selectedItem?.expirationDays ?? null,
      startDateMethod: selectedItem?.startDateMethod,
    };

    // Add giftcard-specific fields if it's a giftcard
    if (selectedItemType === "giftcard") {
      return {
        ...baseItem,
        giftcardRecipientName: watch("addItemGiftcardRecipientName"),
        giftcardFrom: watch("addItemGiftcardFrom"),
        giftcardTo: watch("addItemGiftcardTo"),
        giftcardPersonalMessage: watch("addItemGiftcardPersonalMessage"),
        giftcardDeliveryFormat: watch("addItemGiftcardDeliveryFormat"),
        giftcardValidFrom: watch("addItemGiftcardValidFrom"),
        giftcardBackgroundImage: watch("addItemGiftcardBackgroundImage"),
        giftcardRecipientEmails: watch("addItemGiftcardRecipientEmails"),
        giftcardScheduledDate: watch("addItemGiftcardScheduledDate"),
        giftcardScheduledTime: watch("addItemGiftcardScheduledTime"),
      };
    }

    return baseItem;
  }, [
    priceCts,
    quantity,
    selectedItem,
    selectedItemId,
    selectedItemType,
    applyDiscount,
    discountReason,
    isDiscountReasonRequired,
    giftcardRecipientName,
    giftcardFrom,
    giftcardTo,
    giftcardValidFrom,
    giftcardDeliveryFormat,
    giftcardRecipientEmails,
  ]);

  const handleAddItem = useCallback(() => {
    if (!itemToAdd) return;

    const currentItems = watch("items");
    const newItems = [...currentItems, itemToAdd];

    setValue("items", newItems, {
      shouldDirty: true,
      shouldValidate: true,
    });

    applyAddItemDefaults({ keepItemType: false });
  }, [itemToAdd, applyAddItemDefaults, setValue, watch]);

  return {
    itemToAdd,
    handleAddItem,
    resetAddItemFields,
    handleClear,
  };
};
