import React from "react";

import { FormField, useFormContext } from "@bsport/form";

import {
  type InvoiceItemKind,
  ItemTypeSelector,
  type ItemTypeSelectorProps,
} from "#src/components/buyables/item-type-selector";
import { useCheckoutFlowTrack } from "#src/components/core/checkout-flow-modal/checkout-flow-tracking-context";
import {
  ADD_ITEM_DEFAULT,
  ADD_ITEM_DEFAULT_KEYS,
  GIFTCARD_DEFAULT_KEYS,
  GIFTCARD_FIELDS_DEFAULT,
} from "#src/components/core/checkout-flow-modal/defaults";
import { type CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const ItemTypeSelectorField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const track = useCheckoutFlowTrack();
  const { setValue, getValues } = useFormContext<CheckoutFlowFormState>();

  const resetAddItemFields = (selectedType: InvoiceItemKind) => {
    ADD_ITEM_DEFAULT_KEYS.forEach((key) => {
      const nextValue =
        key === "addItemSelectedItemType"
          ? selectedType
          : ADD_ITEM_DEFAULT[key];
      setValue(key, nextValue, {
        shouldDirty: key === "addItemSelectedItemType",
        shouldValidate: true,
      });
    });
    GIFTCARD_DEFAULT_KEYS.forEach((key) => {
      setValue(key, GIFTCARD_FIELDS_DEFAULT[key], {
        shouldValidate: true,
      });
    });
  };

  return (
    <FormField<
      CheckoutFlowFormState,
      "addItemSelectedItemType",
      ItemTypeSelectorProps
    >
      name="addItemSelectedItemType"
      mapProps={({ field }) => ({
        value: field.value,
        onSelect: (type: InvoiceItemKind) => {
          resetAddItemFields(type);
          track("checkout_flow_item_type_section_selected", {
            item_type: type,
            member_id: getValues().member?.id,
          });
        },
      })}
    >
      <ItemTypeSelector label={t("itemTypeSelector.label")} />
    </FormField>
  );
};
