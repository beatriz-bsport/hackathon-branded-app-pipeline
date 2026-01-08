import { FormField } from "@bsport/form";
import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { PassTriggerConfigValidationFormData } from "#src/utils/schemas/types";

import {
  PASS_ACTION_CREDITS_LEFT,
  PASS_ACTION_DAYS_EXPIRED,
  PASS_ACTION_DAYS_LEFT,
} from "./types";

type PassActionFieldProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PassActionField = ({ value, onChange }: PassActionFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <FormField<PassTriggerConfigValidationFormData, "passEventAction">
      name="passEventAction"
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
        id="pass-notification-trigger-action-field"
        label={t("steps.notificationRules.pass.actionLabel")}
        options={[
          {
            value: PASS_ACTION_CREDITS_LEFT,
            label: t("steps.notificationRules.pass.actions.creditsLeft"),
          },
          {
            value: PASS_ACTION_DAYS_LEFT,
            label: t("steps.notificationRules.pass.actions.daysLeft"),
          },
          {
            value: PASS_ACTION_DAYS_EXPIRED,
            label: t("steps.notificationRules.pass.actions.daysExpired"),
          },
        ]}
        value={value}
        onChange={onChange}
      />
    </FormField>
  );
};
