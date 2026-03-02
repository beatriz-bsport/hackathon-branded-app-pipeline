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
  SelectedDate,
  TimePicker,
  type TimePickerProps,
} from "@bsport/kaizen-primitive-core";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import type { CheckoutFlowFormState } from "#src/components/core/checkout-flow-modal/schema";
import { i18nInstance, useTranslation } from "#src/i18n";

export const ScheduledDateTimeField: React.FC = () => {
  const { t } = useTranslation("core", { i18n: i18nInstance });
  const scheduledDateId = useId();
  const scheduledTimeId = useId();

  const today = getLocalNow({ zone: getCompanyTimezone() });
  const disablePastDates = (date: DateTime) => {
    return date < today.startOf("day");
  };

  return (
    <div className="flex flex-col gap-xs sm:flex-row sm:items-end">
      <FormField<
        CheckoutFlowFormState,
        "addItemGiftcardScheduledDate",
        DatePickerProps
      >
        name="addItemGiftcardScheduledDate"
        mapProps={({ field, form: { setValue } }) => ({
          value: field.value,
          dateValue: field.value ? fromIsoString(field.value) : undefined,
          onSelect: (date: SelectedDate) => {
            setValue(
              "addItemGiftcardScheduledDate",
              date ? date.toString() : today.toString(),
              { shouldDirty: true },
            );
          },
        })}
      >
        <DatePicker
          id={`giftcard-scheduled-date-${scheduledDateId}`}
          disableDate={disablePastDates}
          label={t("checkoutFlowModal.giftCardDetails.scheduledDate")}
          mode="single"
          displayAs="popover"
          isInputField
          required
        />
      </FormField>

      <FormField<
        CheckoutFlowFormState,
        "addItemGiftcardScheduledTime",
        TimePickerProps
      >
        name="addItemGiftcardScheduledTime"
        mapProps={({ field, form: { setValue } }) => ({
          value: field.value,
          onChange: (time: string) => {
            setValue("addItemGiftcardScheduledTime", time, {
              shouldDirty: true,
            });
          },
        })}
      >
        <TimePicker
          id={`giftcard-scheduled-time-${scheduledTimeId}`}
          required
        />
      </FormField>
    </div>
  );
};
