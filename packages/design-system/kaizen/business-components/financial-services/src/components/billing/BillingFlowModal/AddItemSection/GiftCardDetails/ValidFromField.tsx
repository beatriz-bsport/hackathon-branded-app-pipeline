import React, { useId } from "react";

import {
  DateTime,
  fromIsoString,
  getLocalNow,
} from "@bsport/datetime-manipulation";
import { FormField } from "@bsport/form";
import {
  DatePicker,
  type DatePickerProps,
  type SelectedDate,
} from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import type { BillingFlowFormState } from "#src/components/billing/BillingFlowModal/schema";
import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

export const ValidFromField: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });
  const validFromId = useId();

  const today = getLocalNow({ zone: getCompanyTimezone() });
  const disablePastDates = (date: DateTime) => {
    return date < today.startOf("day");
  };

  return (
    <FormField<
      BillingFlowFormState,
      "addItemGiftcardValidFrom",
      DatePickerProps
    >
      name="addItemGiftcardValidFrom"
      mapProps={({ field, form: { setValue } }) => ({
        value: field.value,
        dateValue: field.value ? fromIsoString(field.value) : undefined,
        onSelect: (date: SelectedDate) => {
          setValue(
            "addItemGiftcardValidFrom",
            date ? date.toString() : today.toString(),
            { shouldDirty: true },
          );
        },
      })}
    >
      <DatePicker
        id={`giftcard-valid-from-${validFromId}`}
        disableDate={disablePastDates}
        label={t("billingFlowModal.giftCardDetails.validFrom")}
        mode="single"
        displayAs="popover"
        isInputField
        required
      />
    </FormField>
  );
};
