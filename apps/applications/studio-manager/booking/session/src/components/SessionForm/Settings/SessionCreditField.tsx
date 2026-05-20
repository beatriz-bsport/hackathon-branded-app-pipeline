import { FC } from "react";

import { CreditsInput } from "@bsport/kaizen-business-components/buyables/credits-input";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export const SessionCreditsField: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const creditFactor = companyTheme?.pass_credit_factor ?? 1;

  return (
    <CreditsInput<SessionCreationFormData, "credits">
      fieldName="credits"
      id={`${fieldIdPrefix}-session-credits`}
      passCreditFactor={creditFactor}
      getHelperText={(params) => {
        if (creditFactor === 1) {
          return t(
            "addSessionModal.steps.configureSession.settings.credits.helperText",
          );
        }
        return t(
          "addSessionModal.steps.configureSession.settings.credits.decimalHelperText",
          { credits: params.creditsDisplay },
        );
      }}
    />
  );
};
