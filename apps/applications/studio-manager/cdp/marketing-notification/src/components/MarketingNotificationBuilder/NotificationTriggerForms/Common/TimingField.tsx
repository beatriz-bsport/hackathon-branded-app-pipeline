import { useState } from "react";

import { FormField } from "@bsport/form";
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
  DEFAULT_TIMING_VALUE,
  TEMPORALITY_AFTER,
  TEMPORALITY_BEFORE,
  TIME_UNIT_DAY,
  TIME_UNIT_HOUR,
  type TemporalityType,
  type TimeUnitType,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Common/types";
import {
  isTemporalityTypeCorrect,
  isTimeUnitTypeCorrect,
} from "#src/components/MarketingNotificationBuilder/NotificationTriggerForms/Common/utils";
import { useTranslation } from "#src/utils/i18n";
import type { TimeTriggerConfigValidationFormData } from "#src/utils/schemas/types";

type BookingTimingFieldProps = {
  notificationType:
    | "booking"
    | "subscriptionCreation"
    | "subscriptionFirstBilling"
    | "subscriptionEnd";
  selectedTemporality: TemporalityType;
  selectedTimeUnit: TimeUnitType;
  selectedTimeValue: number;
  updateTimingTemporality: (temporality: TemporalityType) => void;
  updateTimingUnit: (unit: TimeUnitType) => void;
  updateTimingValue: (value: number) => void;
};

export const TimingField = ({
  notificationType,
  selectedTemporality,
  selectedTimeUnit,
  selectedTimeValue,
  updateTimingTemporality,
  updateTimingUnit,
  updateTimingValue,
}: BookingTimingFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  const [timeUnit, setTimeUnit] = useState<TimeUnitType>(
    selectedTimeUnit ?? TIME_UNIT_HOUR,
  );
  const [timeValue, setTimeValue] = useState(
    selectedTimeValue ?? DEFAULT_TIMING_VALUE,
  );
  const [temporality, setTemporality] = useState<TemporalityType>(
    selectedTemporality ?? TEMPORALITY_BEFORE,
  );

  const notificationTimingSummary = `${t(
    "steps.notificationRules.timing.timingValuePrefix.content",
    {
      count: timeValue,
    },
  )} ${t(
    // @ts-expect-error dynamic key management
    `steps.notificationRules.timing.timingValuePrefix.${notificationType}.${temporality}.${timeUnit}`,
    {
      count: isNaN(timeValue) ? 0 : timeValue,
    },
  )}`;

  const notificationTimingError =
    isNaN(timeValue) || timeValue < 0
      ? t(`steps.notificationRules.errors.positiveValue.${timeUnit}`)
      : null;

  const handleTimingTemporalityUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTemporality = event.target.value;
    if (isTemporalityTypeCorrect(newTemporality)) {
      setTemporality(newTemporality);
      updateTimingTemporality(newTemporality);
    }
  };

  const handleTimingUnitSelection = (newTimeUnit: string) => {
    if (isTimeUnitTypeCorrect(newTimeUnit)) {
      updateTimingUnit(newTimeUnit);
      setTimeUnit(newTimeUnit);
    }
  };

  const handleTimingValueUpdate = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newTimeValue = parseInt(event.target.value);
    updateTimingValue(newTimeValue);
    setTimeValue(newTimeValue);
  };

  return (
    <div className="flex flex-col gap-xs w-full">
      <RadioGroup
        label={t(`steps.notificationRules.timing.temporality.label`)}
        id="notification-timing-before-after"
        options={[
          {
            value: TEMPORALITY_BEFORE,
            label: t(
              `steps.notificationRules.timing.temporality.options.${notificationType}.before`,
            ),
          },
          {
            value: TEMPORALITY_AFTER,
            label: t(
              `steps.notificationRules.timing.temporality.options.${notificationType}.after`,
            ),
          },
        ]}
        value={temporality}
        onChange={handleTimingTemporalityUpdate}
      />
      <div className="flex flex-row gap-xs">
        <FormField<
          TimeTriggerConfigValidationFormData,
          "timingUnit",
          SelectProps
        >
          name="timingUnit"
          mapProps={({ defaultProps }) => ({
            ...defaultProps,
            value: timeUnit,
          })}
        >
          <Select
            required
            id="notification-timing-unit"
            label={t("steps.notificationRules.timing.timeUnit.label")}
            items={[
              {
                label: t(
                  "steps.notificationRules.timing.timeUnit.options.hour",
                ),
                id: TIME_UNIT_HOUR,
              },
              {
                label: t("steps.notificationRules.timing.timeUnit.options.day"),
                id: TIME_UNIT_DAY,
              },
            ]}
            onChange={handleTimingUnitSelection}
          />
        </FormField>
        <FormField<
          TimeTriggerConfigValidationFormData,
          "timingValue",
          TextFieldProps
        >
          name="timingValue"
          mapProps={({ defaultProps }) => ({
            ...defaultProps,
            value: String(timeValue),
            min: DEFAULT_TIMING_VALUE,
            onChange: handleTimingValueUpdate,
          })}
        >
          <TextField
            required
            id="notification-timing-value"
            label={t("steps.notificationRules.timing.timeValue.label")}
            type="number"
          />
        </FormField>
      </div>
      <Alert type="weak" status={notificationTimingError ? "critical" : "info"}>
        <Body htmlVariant="p" size="md">
          {notificationTimingError ?? String(notificationTimingSummary)}
        </Body>
      </Alert>
    </div>
  );
};
