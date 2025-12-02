import type { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextArea } from "@bsport/kaizen-primitive-core";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionDescriptionField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isDisabled = !watch("allowCustomNameAndDescription");

  return (
    <FormField<SessionCreationFormData, "description_override">
      name="description_override"
      disabled={isDisabled}
      mapProps={({ defaultProps, field, form }) => ({
        ...defaultProps,
        onClear: () => {
          form.setValue("description_override", "", { shouldDirty: true });
          field.onBlur();
        },
      })}
    >
      <TextArea
        id={`${fieldIdPrefix}-session-description-override`}
        label={t("addSessionModal.steps.configureSession.details.description")}
        required={!isDisabled}
      />
    </FormField>
  );
};
