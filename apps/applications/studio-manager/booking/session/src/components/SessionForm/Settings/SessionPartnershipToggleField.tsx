import { FC } from "react";

import { FormField, useFormContext } from "@bsport/form";
import { Toggle } from "@bsport/kaizen-primitive-core";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionPartnershipToggleField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext();

  const isChecked = watch("available_on_partnership");

  const managerOnly = watch("manager_only");

  return (
    <FormField<
      SessionCreationFormData,
      "available_on_partnership"
    > name="available_on_partnership">
      <Toggle
        disabled={managerOnly}
        checked={isChecked}
        id={`${fieldIdPrefix}-session-partnership-toggle`}
        label={t(
          "addSessionModal.steps.configureSession.settings.partnership.toggle",
        )}
      />
    </FormField>
  );
};
