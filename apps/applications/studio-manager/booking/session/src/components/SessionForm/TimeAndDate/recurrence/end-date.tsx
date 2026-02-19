import { FC, useCallback } from "react";

import {
  type DateTime,
  getLocalNow,
  modifyTime,
} from "@bsport/datetime-manipulation";
import { FormField, useFormContext } from "@bsport/form";
import { DatePicker, DatePickerProps } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { MAX_YEARS_AHEAD } from "#src/components/SessionForm/schemas";
import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const RecurrenceEndDate: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t, i18n } = useTranslation("sessionCreation");

  const locale = i18n.language;

  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  const { watch, setValue } = useFormContext<SessionCreationFormData>();

  const startDate = watch("startDateTime");

  const endDate = watch("recurrenceEndDate");

  const handleDateChange = useCallback(
    (newDate: DateTime | null) => {
      if (!newDate) {
        setValue("recurrenceEndDate", newDate, {
          shouldValidate: true,
          shouldDirty: true,
        });
        return;
      }

      const newDateTime = newDate?.setZone(companyTimeZone);

      setValue("recurrenceEndDate", newDateTime, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue, companyTimeZone],
  );

  const disableDate = useCallback(
    (date: DateTime) => {
      if (!companyTimeZone) return false;

      const dateDT = date.setZone(companyTimeZone);

      if (dateDT < startDate) {
        return true;
      }

      const now = getLocalNow({ zone: companyTimeZone, locale });

      const maxDate = modifyTime({
        datetime: now,
        duration: { year: MAX_YEARS_AHEAD },
        operator: "plus",
      });
      return dateDT > maxDate;
    },
    [companyTimeZone, locale, startDate],
  );

  return (
    <FormField<SessionCreationFormData, "recurrenceEndDate", DatePickerProps>
      name="recurrenceEndDate"
      mapProps={({ fieldState }) => ({
        onSelect: (date) => handleDateChange(date as DateTime | null),
        dateValue: endDate,
        status: fieldState.error ? "error" : "default",
        statusText: fieldState.error?.message,
      })}
    >
      <DatePicker
        displayAs="popover"
        isInputField
        id={`${fieldIdPrefix}-end-date`}
        label={t(
          "addSessionModal.steps.configureSession.timeAndDate.recurrence.endDate",
        )}
        required
        mode="single"
        disableDate={disableDate}
        aria-required="true"
      />
    </FormField>
  );
};
