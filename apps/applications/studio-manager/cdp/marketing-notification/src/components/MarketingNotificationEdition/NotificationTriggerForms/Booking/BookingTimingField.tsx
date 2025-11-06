import { useState } from "react";

import { ControlledFormProps, FormField } from "@bsport/form";
import {
  Alert,
  Body,
  RadioGroup,
  Select,
  type SelectProps,
  TextField,
  type TextFieldProps,
} from "@bsport/kaizen-primitive-core";

import {
  BOOKING_TEMPORALITY_BEFORE,
  BOOKING_TIME_UNIT_DAY,
  BOOKING_TIME_UNIT_HOUR,
  BookingTemporality,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/types";
import {
  isTemporalityTypeCorrect,
  isTimeUnitTypeCorrect,
} from "#src/components/MarketingNotificationEdition/NotificationTriggerForms/Booking/utils";
import { useTranslation } from "#src/utils/i18n";
import type {
  BookingTriggerConfigValidationFormData,
  ConfigTimeUnit,
} from "#src/utils/schemas/types";

type BookingTimingFieldProps = Omit<
  ControlledFormProps<BookingTriggerConfigValidationFormData>,
  "children" | "onSubmit"
>;

export const BookingTimingField = ({ ...methods }: BookingTimingFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const [temporality, setTemporality] = useState<BookingTemporality>(
    BOOKING_TEMPORALITY_BEFORE,
  );
  const { watch } = methods;

  const timeUnit = watch("timingUnit");
  const timeValue = watch("timingValue");

  const bookingTimeUnitMappedToTranslations = {
    [t("steps.notificationRules.booking.timing.timeUnit.options.hour")]:
      BOOKING_TIME_UNIT_HOUR,
    [t("steps.notificationRules.booking.timing.timeUnit.options.day")]:
      BOOKING_TIME_UNIT_DAY,
  };

  const translationsKeyToTimeUnitMap: Record<ConfigTimeUnit, string> = {
    [BOOKING_TIME_UNIT_HOUR]: t(
      "steps.notificationRules.booking.timing.timeUnit.options.hour",
    ),
    [BOOKING_TIME_UNIT_DAY]: t(
      "steps.notificationRules.booking.timing.timeUnit.options.day",
    ),
  };

  const notificationTimingSummary = `${t(
    "steps.notificationRules.booking.timing.timeValue.prefix.content",
  )} ${t(
    // @ts-expect-error bad i18n management
    `steps.notificationRules.booking.timing.timeValue.prefix.${temporality}.${timeUnit}`,
    {
      count: isNaN(timeValue) ? 0 : timeValue,
    },
  )}`;

  return (
    <div className="flex flex-col gap-xs w-full">
      <RadioGroup
        id="notification-timing-before-after"
        options={[
          {
            value: "before",
            label: t(
              "steps.notificationRules.booking.timing.temporality.options.before",
            ),
          },
          {
            value: "after",
            label: t(
              "steps.notificationRules.booking.timing.temporality.options.after",
            ),
          },
        ]}
        value={temporality}
        onChangeValue={(event: React.ChangeEvent<HTMLInputElement>) => {
          const newTemporality = event.target.value;
          if (isTemporalityTypeCorrect(newTemporality)) {
            setTemporality(newTemporality);
            methods.setValue("timingTemporality", newTemporality, {
              shouldValidate: true,
            });
          } else {
            console.warn(
              "[Marketing Notification Modal] - Booking timing temporality do not have a valid type",
            );
          }
        }}
      />
      <div className="flex flex-row gap-xs">
        <FormField<
          BookingTriggerConfigValidationFormData,
          "timingUnit",
          SelectProps
        >
          name="timingUnit"
          mapProps={({ defaultProps, form }) => ({
            ...defaultProps,
            value: translationsKeyToTimeUnitMap[timeUnit],
            onSelect: (option) => {
              const newTimeUnit = bookingTimeUnitMappedToTranslations[option];
              if (isTimeUnitTypeCorrect(newTimeUnit)) {
                form.setValue("timingUnit", newTimeUnit, {
                  shouldValidate: true,
                });
              } else {
                console.warn(
                  "[Marketing Notification Modal] - Booking timing unit do not have a valid type",
                );
              }
            },
          })}
        >
          <Select
            required
            id="notification-timing-unit"
            label={t("steps.notificationRules.booking.timing.timeUnit.label")}
            items={[
              {
                label: t(
                  "steps.notificationRules.booking.timing.timeUnit.options.hour",
                ),
                id: "hour",
              },
              {
                label: t(
                  "steps.notificationRules.booking.timing.timeUnit.options.day",
                ),
                id: "day",
              },
            ]}
          />
        </FormField>
        <FormField<
          BookingTriggerConfigValidationFormData,
          "timingValue",
          TextFieldProps
        >
          name="timingValue"
          mapProps={({ defaultProps, form }) => ({
            ...defaultProps,
            value: String(timeValue),
            min: 0,
            onChange: (event) => {
              const newTimeValue = parseInt(event.target.value);
              form.setValue("timingValue", newTimeValue, {
                shouldValidate: true,
              });
            },
          })}
        >
          <TextField
            required
            id="notification-timing-value"
            label="Timing of notification"
            type="number"
          />
        </FormField>
      </div>
      <Alert type="weak" status="info">
        <Body htmlVariant="p" size="md">
          {String(notificationTimingSummary)}
        </Body>
      </Alert>
    </div>
  );
};
