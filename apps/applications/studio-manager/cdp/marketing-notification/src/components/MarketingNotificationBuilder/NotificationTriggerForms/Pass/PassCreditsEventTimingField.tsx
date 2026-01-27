import { FormField } from "@bsport/form";
import { RadioGroup, TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { PassTriggerConfigValidationFormData } from "#src/utils/schemas/types";

import {
  PASS_CREDITS_LEFT_BOOKING_COMPLETED,
  PASS_CREDITS_LEFT_SESSION_END,
  PassCreditsLeftEventKind,
} from "./types";

type PassCreditsEventTimingFieldProps = {
  selectedKind: PassCreditsLeftEventKind;
  hours: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PassCreditsEventTimingField = ({
  selectedKind,
  hours,
  onChange,
  onAmountChange,
}: PassCreditsEventTimingFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <div className="flex flex-col gap-sm">
      <FormField<PassTriggerConfigValidationFormData, "creditsEventKind">
        name="creditsEventKind"
        mapProps={({ defaultProps, form }) => ({
          ...defaultProps,
          onChange: (event) => {
            onChange(event);
            form.trigger();
          },
        })}
      >
        <RadioGroup
          required
          id="pass-notification-credits-left-timing-event-field"
          label={t("steps.notificationRules.pass.creditsLeft.label")}
          options={[
            {
              value: PASS_CREDITS_LEFT_BOOKING_COMPLETED,
              label: t(
                "steps.notificationRules.pass.creditsLeft.bookingCompleted.label",
              ),
            },
            {
              value: PASS_CREDITS_LEFT_SESSION_END,
              label: t(
                "steps.notificationRules.pass.creditsLeft.sessionEnd.label",
              ),
            },
          ]}
          value={selectedKind}
        />
      </FormField>
      <FormField<PassTriggerConfigValidationFormData, "hours">
        name="hours"
        mapProps={({ defaultProps }) => ({
          ...defaultProps,
          value: String(hours),
          min: 0,
          onChange: (event) => onAmountChange(event),
        })}
      >
        <TextField
          id="pass-credits-left-hours-field"
          type="number"
          suffix={{
            type: "text",
            value: String(
              t(
                // @ts-expect-error: bad plural management
                `steps.notificationRules.pass.creditsLeft.${selectedKind}.suffix`,
                {
                  count: hours,
                },
              ),
            ),
          }}
        />
      </FormField>
    </div>
  );
};
