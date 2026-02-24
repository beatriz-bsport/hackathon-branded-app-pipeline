import { FC, useCallback } from "react";

import {
  type DateTime,
  getLocalNow,
  modifyTime,
} from "@bsport/datetime-manipulation";
import { useFormContext } from "@bsport/form";
import { DatePicker, TimePicker } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { MAX_YEARS_AHEAD } from "#src/components/SessionForm/schemas";
import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionStartDateTime: FC<{
  fieldIdPrefix: string;
  disableBeforeStartDate?: DateTime;
}> = ({ fieldIdPrefix, disableBeforeStartDate }) => {
  const { t, i18n } = useTranslation("sessionCreation");

  const { watch, setValue, formState } =
    useFormContext<SessionCreationFormData>();

  const startDateTime = watch("startDateTime");

  const error = formState.errors.startDateTime?.message;

  const locale = i18n.language;

  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

  // When date changes, preserve the time
  const handleDateChange = useCallback(
    (newDate: DateTime | null) => {
      if (!newDate) {
        return;
      }
      const newDateTime = newDate.setZone(companyTimeZone);

      const updatedDateTime = newDateTime.set({
        hour: startDateTime.hour,
        minute: startDateTime.minute,
        second: 0,
        millisecond: 0,
      });

      setValue("startDateTime", updatedDateTime, {
        shouldValidate: true,
        shouldDirty: true,
      });

      setValue(
        "recurrenceEndDate",
        modifyTime({
          datetime: newDateTime,
          duration: { day: 1 },
          operator: "plus",
        }),
        {
          shouldValidate: true,
          shouldDirty: true,
        },
      );
    },
    [startDateTime, setValue, companyTimeZone],
  );

  // When time changes, preserve the date
  const handleTimeChange = useCallback(
    (newTime: string) => {
      if (!newTime) {
        return;
      }

      const [hour, minute] = newTime.split(":").map(Number);

      const updatedDateTime = startDateTime.set({
        hour,
        minute,
        second: 0,
        millisecond: 0,
      });

      setValue("startDateTime", updatedDateTime, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [startDateTime, setValue],
  );

  const disableDateTooFar = useCallback(
    (date: DateTime) => {
      if (!companyTimeZone) return false;

      const dateDT = date.setZone(companyTimeZone);
      const now = getLocalNow({ zone: companyTimeZone, locale });

      const maxDate = modifyTime({
        datetime: now,
        duration: { year: MAX_YEARS_AHEAD },
        operator: "plus",
      });
      return dateDT > maxDate;
    },
    [companyTimeZone, locale],
  );

  const disableDateBeforeStartDate = useCallback(
    (date: DateTime) => {
      if (!companyTimeZone) return false;
      if (!disableBeforeStartDate) return false;

      const dateDT = date.setZone(companyTimeZone);
      return dateDT.startOf("day") < disableBeforeStartDate.startOf("day");
    },
    [companyTimeZone, disableBeforeStartDate],
  );

  const disableDate = useCallback(
    (date: DateTime) => {
      return disableDateTooFar(date) || disableDateBeforeStartDate(date);
    },
    [disableDateTooFar, disableDateBeforeStartDate],
  );

  const timeString = startDateTime?.toFormat("HH:mm");

  return (
    <div className="flex flex-col gap-sm md:flex-row md:gap-md">
      <DatePicker
        displayAs="popover"
        isInputField
        id={`${fieldIdPrefix}-start-date`}
        label={t("addSessionModal.steps.configureSession.timeAndDate.date")}
        required
        mode="single"
        defaultValue={startDateTime}
        onSelect={(date) => {
          if (!Array.isArray(date)) {
            handleDateChange(date);
          }
        }}
        disableDate={disableDate}
        aria-required="true"
        status={error ? "error" : "default"}
        statusText={error?.toString()}
      />

      <TimePicker
        id={`${fieldIdPrefix}-start-time`}
        label={t("addSessionModal.steps.configureSession.timeAndDate.time")}
        required
        value={timeString}
        onChange={handleTimeChange}
      />
    </div>
  );
};
