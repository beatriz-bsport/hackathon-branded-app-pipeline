import { useCallback, useId } from "react";

import {
  type DateTime,
  fromIsoString,
  getLocalNow,
} from "@bsport/datetime-manipulation";
import {
  type FieldPath,
  type FieldValues,
  FormField,
  useFormContext,
} from "@bsport/form";
import {
  Body,
  DatePicker,
  type DatePickerProps,
  type SelectedDate,
  TimePicker,
  type TimePickerProps,
  Title,
  ToggleButton,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_SEND_NOW,
} from "./campaign-delivery-mode.constants";
import { useScheduledDateTimeValidator } from "./use-scheduled-date-time-validator";

type CampaignDeliveryModeSelectorProps<TFormValues extends FieldValues> = {
  companyTimezone: string;
  locale: string;
  /** Defaults to `deliveryMode` when omitted. */
  deliveryModeFieldName?: FieldPath<TFormValues>;
  /** Defaults to `scheduledDate` when omitted. */
  scheduledDateFieldName?: FieldPath<TFormValues>;
  /** Defaults to `scheduledTime` when omitted. */
  scheduledTimeFieldName?: FieldPath<TFormValues>;
  /** This value should always come from the company theme `earliest_hour_to_send_communications` field and be between 0 and 23. */
  earliestHourToSend?: number;
  /** This value should always come from the company theme `latest_hour_to_send_communications` field and be between 0 and 23. */
  latestHourToSend?: number;
};

/**
 * Generic delivery mode selector (send now / schedule later) for campaign-like forms.
 *
 * Expected field shape (by default):
 * - `deliveryMode`: "send_now" | "schedule_later"
 * - `scheduledDate`?: ISO date string
 * - `scheduledTime`?: "HH:mm"
 *
 * You can override those field paths when your form schema uses different names.
 */
export const CampaignDeliveryModeSelector = <TFormValues extends FieldValues>({
  companyTimezone,
  locale,
  deliveryModeFieldName,
  scheduledDateFieldName,
  scheduledTimeFieldName,
  earliestHourToSend,
  latestHourToSend,
}: CampaignDeliveryModeSelectorProps<TFormValues>) => {
  const { t } = useTranslation("campaign");
  const baseId = useId();
  const deliveryModePath = (deliveryModeFieldName ??
    "deliveryMode") as FieldPath<TFormValues>;
  const scheduledDatePath = (scheduledDateFieldName ??
    "scheduledDate") as FieldPath<TFormValues>;
  const scheduledTimePath = (scheduledTimeFieldName ??
    "scheduledTime") as FieldPath<TFormValues>;

  const { watch, setValue, clearErrors, formState } =
    useFormContext<TFormValues>();
  const scheduledDateError = formState.errors[scheduledDatePath]?.message;
  const scheduledTimeError = formState.errors[scheduledTimePath]?.message;
  const deliveryMode = watch(deliveryModePath);
  const scheduledDateValidation = useScheduledDateTimeValidator({
    companyTimezone,
    locale,
    date: watch(scheduledDatePath),
    time: watch(scheduledTimePath),
    earliestHourToSend,
    latestHourToSend,
  });

  const handleSendNowClick = useCallback(() => {
    setValue(
      deliveryModePath,
      DELIVERY_MODE_SEND_NOW as TFormValues[typeof deliveryModePath],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
    setValue(
      scheduledDatePath,
      undefined as TFormValues[typeof scheduledDatePath],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
    setValue(
      scheduledTimePath,
      undefined as TFormValues[typeof scheduledTimePath],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
    clearErrors([scheduledDatePath, scheduledTimePath]);
  }, [
    setValue,
    clearErrors,
    deliveryModePath,
    scheduledDatePath,
    scheduledTimePath,
  ]);

  const handleScheduleLaterClick = useCallback(() => {
    setValue(
      deliveryModePath,
      DELIVERY_MODE_SCHEDULE_LATER as TFormValues[typeof deliveryModePath],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  }, [setValue, deliveryModePath]);

  const today = getLocalNow({ zone: companyTimezone });
  const disablePastDates = useCallback(
    (date: DateTime) => date.startOf("day") < today.startOf("day"),
    [today],
  );
  const isScheduled = deliveryMode === DELIVERY_MODE_SCHEDULE_LATER;

  return (
    <div className="flex flex-col gap-md">
      <div className="flex flex-col gap-xs">
        <Title htmlVariant="h2" weight="strong">
          {t("generic.creation.delivery.title")}
        </Title>
        <Body htmlVariant="p" size="md" weight="weak" color="weak">
          {t("generic.creation.delivery.label")}
        </Body>
      </div>

      <div className="flex flex-row gap-xs">
        <ToggleButton
          id={`${baseId}-send-now`}
          size="md"
          checked={deliveryMode === DELIVERY_MODE_SEND_NOW}
          onChange={({ checked }) => {
            if (checked) handleSendNowClick();
          }}
          checkedConfig={{
            label: t("generic.creation.delivery.sendNow"),
            iconLeft: "send-03",
          }}
          uncheckedConfig={{
            label: t("generic.creation.delivery.sendNow"),
            iconLeft: "send-03",
          }}
        />
        <ToggleButton
          id={`${baseId}-schedule-later`}
          size="md"
          checked={isScheduled}
          onChange={({ checked }) => {
            if (checked) handleScheduleLaterClick();
          }}
          checkedConfig={{
            label: t("generic.creation.delivery.scheduleForLater"),
            iconLeft: "clock",
          }}
          uncheckedConfig={{
            label: t("generic.creation.delivery.scheduleForLater"),
            iconLeft: "clock",
          }}
        />
      </div>

      {isScheduled && (
        <div className="flex flex-col gap-xs sm:flex-row sm:items-end">
          <FormField<TFormValues, FieldPath<TFormValues>, DatePickerProps>
            name={scheduledDatePath}
            mapProps={({ field, form: { setValue: setFormValue } }) => {
              const dateValue = field.value
                ? fromIsoString(field.value, { zone: companyTimezone })
                : undefined;
              return {
                dateValue,
                onSelect: (date: SelectedDate) => {
                  const value =
                    date && !Array.isArray(date)
                      ? (date.toISODate() ?? "")
                      : "";
                  setFormValue(
                    scheduledDatePath,
                    (value ||
                      undefined) as TFormValues[typeof scheduledDatePath],
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                },
                status:
                  scheduledDateError || scheduledTimeError
                    ? "error"
                    : "default",
              };
            }}
          >
            <DatePicker
              id={`campaign-scheduled-date-${baseId}`}
              mode="single"
              displayAs="popover"
              isInputField
              label={t("generic.creation.delivery.dateLabel")}
              required
              disableDate={disablePastDates}
            />
          </FormField>

          <div className="flex flex-col gap-2xs">
            <FormField<TFormValues, FieldPath<TFormValues>, TimePickerProps>
              name={scheduledTimePath}
              mapProps={({ field, form: { setValue: setFormValue } }) => ({
                value: field.value ?? "",
                onChange: (time: string) => {
                  setFormValue(
                    scheduledTimePath,
                    (time ||
                      undefined) as TFormValues[typeof scheduledTimePath],
                    {
                      shouldDirty: true,
                      shouldValidate: true,
                    },
                  );
                },
              })}
            >
              <TimePicker
                id={`campaign-scheduled-time-${baseId}`}
                label={t("generic.creation.delivery.timeLabel")}
                required
              />
            </FormField>
          </div>
        </div>
      )}
      {scheduledDateValidation.length > 0 && (
        <div className="flex flex-col gap-xs">{scheduledDateValidation}</div>
      )}
    </div>
  );
};
