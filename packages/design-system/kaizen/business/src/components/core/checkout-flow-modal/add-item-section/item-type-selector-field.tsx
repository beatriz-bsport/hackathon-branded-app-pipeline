import React from "react";

import { FormField, useFormContext } from "@bsport/form";

import {
  type InvoiceItemKind,
  ItemTypeSelector,
  type ItemTypeSelectorProps,
} from "#src/components/buyables/item-type-selector";
import { useCheckoutFlowTrack } from "#src/components/core/checkout-flow-modal/checkout-flow-tracking-context";
import { ADD_ITEM_DEFAULT } from "#src/components/core/checkout-flow-modal/defaults";
import { type CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const ItemTypeSelectorField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const track = useCheckoutFlowTrack();
  const { reset, getValues } = useFormContext<CheckoutFlowFormState>();

  const resetAddItemFields = () => {
    const current = getValues();
    const addItemDefaults = { ...ADD_ITEM_DEFAULT };
    reset({ ...current, ...addItemDefaults });
  };

  return (
    <FormField<
      CheckoutFlowFormState,
      "addItemSelectedItemType",
      ItemTypeSelectorProps
    >
      name="addItemSelectedItemType"
      mapProps={({ form: { setValue }, field }) => ({
        value: field.value,
        onSelect: (type: InvoiceItemKind) => {
          resetAddItemFields();
          setValue("addItemSelectedItemType", type, { shouldDirty: true });
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
