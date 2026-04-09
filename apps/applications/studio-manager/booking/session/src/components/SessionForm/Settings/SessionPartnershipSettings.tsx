import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useCappingDefaultValue } from "#src/hooks/useCappingDefaultValue";
import { useTranslation } from "#src/utils/i18n";

import { SessionFormData } from "../schemas";
import { SessionCappingStrategyRadio } from "./SessionCappingStrategyRadio";
import { SessionPartnershipChips } from "./SessionPartnershipChips";
import { SessionPartnershipToggleField } from "./SessionPartnershipToggleField";

export const SessionPartnershipSettings: FC<{
  fieldIdPrefix: string;
  isEditMode?: boolean;
}> = ({ fieldIdPrefix, isEditMode = false }) => {
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const { t } = useTranslation("sessionCreation");

  const { watch } = useFormContext<SessionFormData>();

  const isPartnershipAvailable = watch("available_on_partnership");
  const establishment = watch("establishment");

  const { activeAccounts } = useCappingDefaultValue({ isEditMode });

  if (!companyTheme?.has_partnership) return null;

  return (
    <>
      <SessionPartnershipToggleField fieldIdPrefix={fieldIdPrefix} />
      {isPartnershipAvailable && (
        <div className="ml-xl">
          {!establishment ? (
            <Alert status="default">
              {t(
                "addSessionModal.steps.configureSession.settings.partnership.noEstablishment",
                { ns: "sessionCreation" },
              )}
            </Alert>
          ) : (
            <>
              <SessionPartnershipChips
                activeAccounts={activeAccounts}
                fieldIdPrefix={fieldIdPrefix}
              />
              <SessionCappingStrategyRadio
                activeAccounts={activeAccounts}
                fieldIdPrefix={fieldIdPrefix}
              />
            </>
          )}
        </div>
      )}
    </>
  );
};
