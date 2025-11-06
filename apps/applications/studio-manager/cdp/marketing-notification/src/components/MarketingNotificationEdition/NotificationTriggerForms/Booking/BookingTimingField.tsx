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
  BOOKING_TIME_UNIT_DAY,
  BOOKING_TIME_UNIT_HOUR,
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

import { MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT } from "./BookingNotificationTriggerField";

type BookingTimingFieldProps = {
  setFormValue: ControlledFormProps<BookingTriggerConfigValidationFormData>["setValue"];
  watchFormValue: ControlledFormProps<BookingTriggerConfigValidationFormData>["watch"];
};

export const BookingTimingField = ({
  setFormValue,
  watchFormValue,
}: BookingTimingFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");

  const temporality = watchFormValue("timingTemporality");
  const timeUnit = watchFormValue("timingUnit");
  const timeValue = watchFormValue("timingValue");

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

  const handleTimingTemporalityUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTemporality = event.target.value;
    if (isTemporalityTypeCorrect(newTemporality)) {
      setFormValue("timingTemporality", newTemporality, {
        shouldValidate: true,
      });
    } else {
      console.warn(
        "[Marketing Notification Modal] - Booking timing temporality do not have a valid type",
      );
    }
  };

  const handleTimingUnitSelection = (option: string) => {
    const newTimeUnit = bookingTimeUnitMappedToTranslations[option];
    if (isTimeUnitTypeCorrect(newTimeUnit)) {
      setFormValue("timingUnit", newTimeUnit, {
        shouldValidate: true,
      });
    } else {
      console.warn(
        "[Marketing Notification Modal] - Booking timing unit do not have a valid type",
      );
    }
  };

  const handleTimingValueUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTimeValue = parseInt(event.target.value);
    setFormValue("timingValue", newTimeValue, {
      shouldValidate: true,
    });
  };

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
        onChangeValue={handleTimingTemporalityUpdate}
      />
      <div className="flex flex-row gap-xs">
        <FormField<
          BookingTriggerConfigValidationFormData,
          "timingUnit",
          SelectProps
        >
          name="timingUnit"
          mapProps={({ defaultProps }) => ({
            ...defaultProps,
            value: translationsKeyToTimeUnitMap[timeUnit],
            onSelect: handleTimingUnitSelection,
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
          mapProps={({ defaultProps }) => ({
            ...defaultProps,
            value: String(timeValue),
            min: MIN_BOOKING_OCCURENCE_SPECIFIC_AMOUNT,
            onChange: handleTimingValueUpdate,
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
