import type { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextField } from "@bsport/kaizen-primitive-core";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionNameField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isDisabled = !watch("allowCustomNameAndDescription");

  return (
    <FormField<SessionCreationFormData, "name_override">
      name="name_override"
      disabled={isDisabled}
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        onClear: () => {
          form.setValue("name_override", "", { shouldDirty: true });
          field.onBlur();
        },
      })}
    >
      <TextField
        id={`${fieldIdPrefix}-session-name-override`}
        label={t("addSessionModal.steps.configureSession.details.sessionName")}
        required={!isDisabled}
        fullWidth
      />
    </FormField>
  );
};
