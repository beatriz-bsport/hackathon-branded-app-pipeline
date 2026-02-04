import React from "react";

import { FormField, useFormContext } from "@bsport/form";

import { ADD_ITEM_DEFAULT } from "#src/components/billing/BillingFlowModal/defaults";
import { type BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import ItemTypeSelector, {
  type InvoiceItemKind,
  type ItemTypeSelectorProps,
} from "#src/components/billing/ItemTypeSelector";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const ItemTypeSelectorField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const { reset, getValues } = useFormContext<BillingFlowFormState>();

  const resetAddItemFields = () => {
    const current = getValues();
    const addItemDefaults = { ...ADD_ITEM_DEFAULT };
    reset({ ...current, ...addItemDefaults });
  };

  return (
    <FormField<
      BillingFlowFormState,
      "addItemSelectedItemType",
      ItemTypeSelectorProps
    >
      name="addItemSelectedItemType"
      mapProps={({ form: { setValue }, field }) => ({
        value: field.value,
        onSelect: (type: InvoiceItemKind) => {
          resetAddItemFields();
          setValue("addItemSelectedItemType", type, { shouldDirty: true });
        },
      })}
    >
      <ItemTypeSelector label={t("itemTypeSelector.label")} />
    </FormField>
  );
};
