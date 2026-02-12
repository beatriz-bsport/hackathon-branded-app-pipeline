import React from "react";

import { FormField, useFormContext } from "@bsport/form";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import {
  getSearchItemType,
  isAddItemFormAllowedType,
} from "#src/components/billing/BillingFlowModal/utils";
import type {
  ItemAutocompleteItem,
  ItemAutocompleteProps,
} from "#src/components/billing/ItemAutocomplete";
import ItemAutocomplete from "#src/components/billing/ItemAutocomplete";
import { useSearchItems } from "#src/components/billing/ItemAutocomplete/use-search-items";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

const parsePriceCtsFromItem = (
  item: ItemAutocompleteItem | undefined,
): number => {
  if (!item?.priceLabel) return 0;
  const normalized = item.priceLabel
    .replace(/[^\d.,-]/g, "")
    .replace(/\s/g, "");
  const normalizedNumber =
    normalized.includes(",") && !normalized.includes(".")
      ? normalized.replace(",", ".")
      : normalized.replace(/,/g, "");
  const priceValue = Number.parseFloat(normalizedNumber);
  return Number.isFinite(priceValue) ? Math.round(priceValue * 100) : 0;
};

export const ItemAutocompleteField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { watch } = useFormContext<BillingFlowFormState>();

  const selectedItemType = watch("addItemSelectedItemType");
  const selectedItemId = watch("addItemSelectedItemId");
  const itemSearchValue = watch("addItemSearchValue");

  // For useSearchItems, we need a valid item type. Use "pass" as fallback for the hook call,
  // but we'll return null below if the type is invalid anyway.
  const searchItemType = getSearchItemType(selectedItemType);

  const { data: searchItems = [] } = useSearchItems({
    itemType: searchItemType,
    searchInput: itemSearchValue,
  });

  if (!isAddItemFormAllowedType(selectedItemType)) return null;

  return (
    <FormField<
      BillingFlowFormState,
      "addItemSelectedItemId",
      ItemAutocompleteProps
    >
      name="addItemSelectedItemId"
      mapProps={({ form: { setValue } }) => ({
        onSelect: (itemId: string) => {
          const item = searchItems.find(
            (i: ItemAutocompleteItem) => i.id === itemId,
          );
          const itemPriceCts = parsePriceCtsFromItem(item);
          setValue("addItemSelectedItemId", itemId, { shouldDirty: true });
          setValue("addItemSelectedItemPriceCts", itemPriceCts, {
            shouldDirty: true,
          });

          if (selectedItemType === "giftcard" && item) {
            setValue("addItemGiftcardRecipientName", item.title, {
              shouldDirty: true,
            });
            setValue(
              "addItemSelectedItemExpirationDays",
              item.expirationDays ?? null,
              { shouldDirty: true },
            );
          }
        },
        onValueChange: (value: string) => {
          setValue("addItemSearchValue", value, { shouldDirty: true });
        },
      })}
    >
      <ItemAutocomplete
        itemType={selectedItemType}
        selectedItemId={selectedItemId}
        textfieldProps={{
          label: t("billingFlowModal.searchItem"),
          placeholder: t("billingFlowModal.searchItemPlaceholder"),
          required: true,
        }}
      />
    </FormField>
  );
};
