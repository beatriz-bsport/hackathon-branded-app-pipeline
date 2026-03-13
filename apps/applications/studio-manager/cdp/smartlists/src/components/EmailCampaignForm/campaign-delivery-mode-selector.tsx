import React, { useCallback, useId } from "react";

import {
  type DateTime,
  fromIsoString,
  getLocalNow,
} from "@bsport/datetime-manipulation";
import { FormField, useFormContext } from "@bsport/form";
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
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_SEND_NOW,
} from "./constants";
import type { EmailCampaignFormData } from "./types";
import { useScheduledDateTimeValidator } from "./use-scheduled-date-time-validator";

export const CampaignDeliveryModeSelector: React.FC = () => {
  const { t } = useTranslation("campaign");
  const baseId = useId();

  const { watch, setValue, clearErrors, formState } =
    useFormContext<EmailCampaignFormData>();
  const scheduledDateError = formState.errors.scheduledDate?.message;
  const scheduledTimeError = formState.errors.scheduledTime?.message;
  const companyTimezone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? "UTC";
  const deliveryMode = watch("deliveryMode");
  const scheduledDateValidation = useScheduledDateTimeValidator({
    companyTimezone,
    date: watch("scheduledDate"),
    time: watch("scheduledTime"),
  });

  const handleSendNowClick = useCallback(() => {
    setValue("deliveryMode", DELIVERY_MODE_SEND_NOW, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("scheduledDate", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("scheduledTime", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
    clearErrors(["scheduledDate", "scheduledTime"]);
  }, [setValue, clearErrors]);

  const handleScheduleLaterClick = useCallback(() => {
    setValue("deliveryMode", DELIVERY_MODE_SCHEDULE_LATER, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [setValue]);

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
          {t("email.creation.delivery.title")}
        </Title>
        <Body htmlVariant="p" size="md" weight="weak" color="weak">
          {t("email.creation.delivery.label")}
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
            label: t("email.creation.delivery.sendNow"),
            iconLeft: "send-03",
          }}
          uncheckedConfig={{
            label: t("email.creation.delivery.sendNow"),
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
            label: t("email.creation.delivery.scheduleForLater"),
            iconLeft: "clock",
          }}
          uncheckedConfig={{
            label: t("email.creation.delivery.scheduleForLater"),
            iconLeft: "clock",
          }}
        />
      </div>

      {isScheduled && (
        <div className="flex flex-col gap-xs sm:flex-row sm:items-end">
          <FormField<EmailCampaignFormData, "scheduledDate", DatePickerProps>
            name="scheduledDate"
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
                  setFormValue("scheduledDate", value || undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
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
              label={t("email.creation.delivery.dateLabel")}
              required
              disableDate={disablePastDates}
            />
          </FormField>

          <div className="flex flex-col gap-2xs">
            <FormField<EmailCampaignFormData, "scheduledTime", TimePickerProps>
              name="scheduledTime"
              mapProps={({ field, form: { setValue: setFormValue } }) => ({
                value: field.value ?? "",
                onChange: (time: string) => {
                  setFormValue("scheduledTime", time || undefined, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                },
              })}
            >
              <TimePicker
                id={`campaign-scheduled-time-${baseId}`}
                label={t("email.creation.delivery.timeLabel")}
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
