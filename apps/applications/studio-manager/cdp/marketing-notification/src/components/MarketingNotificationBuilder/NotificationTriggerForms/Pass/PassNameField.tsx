import { FormField } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { PassTriggerConfigValidationFormData } from "#src/utils/schemas/types";

type PassNameFieldProps = {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const PassNameField = ({ onChange }: PassNameFieldProps) => {
  const { t } = useTranslation("marketingNotificationsModal");
  return (
    <FormField<PassTriggerConfigValidationFormData, "name">
      name="name"
      mapProps={({ defaultProps, form, field }) => ({
        ...defaultProps,
        value: field.value || "",
        onClear: () => {
          form.setValue("name", "", { shouldDirty: true });
        },
      })}
    >
      <TextField
        required
        fullWidth
        id="pass-notification-name-field"
        label={t("steps.notificationRules.pass.name.label")}
        placeholder={t("steps.notificationRules.pass.name.placeholder")}
        onChange={onChange}
      />
    </FormField>
  );
};
