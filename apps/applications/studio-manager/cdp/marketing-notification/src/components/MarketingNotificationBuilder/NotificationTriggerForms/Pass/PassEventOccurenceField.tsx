import { FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { PassTriggerConfigValidationFormData } from "#src/utils/schemas/types";

import type { PassActionEventType } from "./types";

type PassEventOccurenceFieldProps = {
  eventType: PassActionEventType;
  value: number;
  fieldError?: string;
  onChange: (value: number) => void;
};

export const PassEventOccurenceField = ({
  eventType,
  value,
  fieldError,
  onChange,
}: PassEventOccurenceFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");

  const handleFieldUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(event.target.value);
    onChange(newAmount);
  };

  const textFieldSuffix = String(
    t(
      // @ts-expect-error dynamic key issue
      `steps.notificationRules.pass.eventOccurence.${eventType}.suffix`,
      {
        count: isNaN(value) ? 1 : value,
      },
    ),
  );

  const formFieldName = eventType === "credits" ? "creditsLeft" : "daysLeft";

  return (
    <FormField<PassTriggerConfigValidationFormData, typeof formFieldName>
      name={formFieldName}
      mapProps={({ defaultProps, form }) => ({
        ...defaultProps,
        status: fieldError ? "error" : "default",
        statusText: fieldError ?? "",
        value: String(value),
        onChange: handleFieldUpdate,
        onBlur: () => {
          if (isNaN(value)) {
            form.setValue(formFieldName, 0, { shouldValidate: true });
          }
        },
      })}
    >
      <TextField
        required
        id="notification-timing-value"
        label={t("steps.notificationRules.pass.eventOccurence.label")}
        type="number"
        min={0}
        suffix={{
          type: "text",
          value: textFieldSuffix,
        }}
      />
    </FormField>
  );
};
