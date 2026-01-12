import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Alert, Toggle } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const HybridSessionField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isChecked = watch("is_hybrid");

  return (
    <div className="flex flex-col gap-md ">
      <FormField<SessionCreationFormData, "is_hybrid"> name="is_hybrid">
        <Toggle
          checked={isChecked}
          id={`${fieldIdPrefix}-hybrid-session-field`}
          label={t(
            "addSessionModal.steps.configureSession.settings.hybrid.label",
          )}
        />
      </FormField>
      {isChecked && (
        <Alert status="info" className="ml-xl">
          {t("addSessionModal.steps.configureSession.settings.hybrid.info")}
        </Alert>
      )}
    </div>
  );
};
