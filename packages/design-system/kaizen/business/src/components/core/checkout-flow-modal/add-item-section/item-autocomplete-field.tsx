import React from "react";

import type { Fetch } from "@bsport/fetch";
import { FormField, useFormContext } from "@bsport/form";

import type {
  ItemAutocompleteItem,
  ItemAutocompleteProps,
} from "#src/components/buyables/item-autocomplete";
import { ItemAutocomplete } from "#src/components/buyables/item-autocomplete";
import { useSearchItems } from "#src/components/buyables/item-autocomplete/use-search-items";
import { useCheckoutFlowTrack } from "#src/components/core/checkout-flow-modal/checkout-flow-tracking-context";
import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import {
  getSearchItemType,
  isAddItemFormAllowedType,
} from "#src/components/core/checkout-flow-modal/utils";
import { i18nInstance, useTranslation } from "#src/i18n";

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

type ItemAutocompleteFieldProps = {
  fetch: Fetch;
};

export const ItemAutocompleteField: React.FC<ItemAutocompleteFieldProps> = ({
  fetch,
}) => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const track = useCheckoutFlowTrack();
  const { watch } = useFormContext<CheckoutFlowFormState>();
  const quantity = watch("addItemQuantity");

  const selectedItemType = watch("addItemSelectedItemType");
  const selectedItemId = watch("addItemSelectedItemId");
  const itemSearchValue = watch("addItemSearchValue");

  // For useSearchItems, we need a valid item type. Use "pass" as fallback for the hook call,
  // but we'll return null below if the type is invalid anyway.
  const searchItemType = getSearchItemType(selectedItemType);

  const { data: searchItems = [] } = useSearchItems({
    fetch,
    itemType: searchItemType,
    searchInput: itemSearchValue,
  });

  if (!isAddItemFormAllowedType(selectedItemType)) return null;

  return (
    <FormField<
      CheckoutFlowFormState,
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

          if (item && selectedItemType) {
            const priceCts = parsePriceCtsFromItem(item);
            track("checkout_flow_item_selected", {
              item_id: Number(itemId),
              item_name: item.title,
              item_type: selectedItemType,
              item_quantity: quantity,
              item_price: priceCts,
              member_id: watch("member")?.id,
            });
          }
        },
        onValueChange: (value: string) => {
          setValue("addItemSearchValue", value, { shouldDirty: true });
        },
      })}
    >
      <ItemAutocomplete
        fetch={fetch}
        itemType={selectedItemType}
        selectedItemId={selectedItemId}
        textfieldProps={{
          label: t("checkoutFlowModal.searchItem"),
          placeholder: t("checkoutFlowModal.searchItemPlaceholder"),
          required: true,
        }}
      />
    </FormField>
  );
};
