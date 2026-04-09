import { useId } from "react";

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

import { useTranslation } from "#src/utils/i18n";

import {
  DELIVERY_MODE_SCHEDULE_LATER,
  DELIVERY_MODE_SEND_NOW,
  type DeliveryMode,
} from "./campaign-delivery-mode.constants";
import { useScheduledDateTimeValidator } from "./use-scheduled-date-time-validator";

type CampaignDeliveryModeFormValues = {
  deliveryMode: DeliveryMode;
  scheduledDate?: string;
  scheduledTime?: string;
};

type CampaignDeliveryModeSelectorProps = {
  companyTimezone: string;
  locale: string;
  /** This value should always come from the company theme `earliest_hour_to_send_communications` field and be between 0 and 23. */
  earliestHourToSend?: number;
  /** This value should always come from the company theme `latest_hour_to_send_communications` field and be between 0 and 23. */
  latestHourToSend?: number;
};

/**
 * Delivery mode selector (send now / schedule later) for campaign-like forms.
 *
 * Expected field shape:
 * - `deliveryMode`: "send_now" | "schedule_later"
 * - `scheduledDate`?: ISO date string
 * - `scheduledTime`?: "HH:mm"
 */
export const CampaignDeliveryModeSelector = ({
  companyTimezone,
  locale,
  earliestHourToSend,
  latestHourToSend,
}: CampaignDeliveryModeSelectorProps) => {
  const { t } = useTranslation("campaign");
  const baseId = useId();
  const { watch, setValue, clearErrors, formState } =
    useFormContext<CampaignDeliveryModeFormValues>();
  const scheduledDateError = formState.errors.scheduledDate?.message;
  const scheduledTimeError = formState.errors.scheduledTime?.message;
  const deliveryMode = watch("deliveryMode");
  const scheduledDateValidation = useScheduledDateTimeValidator({
    companyTimezone,
    locale,
    date: watch("scheduledDate"),
    time: watch("scheduledTime"),
    earliestHourToSend,
    latestHourToSend,
  });

  const handleSendNowClick = () => {
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
  };

  const handleScheduleLaterClick = () => {
    setValue("deliveryMode", DELIVERY_MODE_SCHEDULE_LATER, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const today = getLocalNow({ zone: companyTimezone });
  const disablePastDates = (date: DateTime) =>
    date.startOf("day") < today.startOf("day");
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
          <FormField<
            CampaignDeliveryModeFormValues,
            "scheduledDate",
            DatePickerProps
          >
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
              label={t("generic.creation.delivery.dateLabel")}
              required
              disableDate={disablePastDates}
            />
          </FormField>

          <div className="flex flex-col gap-2xs">
            <FormField<
              CampaignDeliveryModeFormValues,
              "scheduledTime",
              TimePickerProps
            >
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
