import type { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { TextArea, TextAreaProps } from "@bsport/kaizen-primitive-core";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionDescriptionField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isDisabled = !watch("allowCustomNameAndDescription");

  return (
    <FormField<SessionCreationFormData, "description_override", TextAreaProps>
      name="description_override"
      disabled={isDisabled}
    >
      <TextArea
        id={`${fieldIdPrefix}-session-description-override`}
        label={t("addSessionModal.steps.configureSession.details.description")}
        required={!isDisabled}
      />
    </FormField>
  );
};
