import { FC } from "react";

import { PartnerSpotCappingStrategy } from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useCappingDefaultValue } from "#src/hooks/useCappingDefaultValue";

import { SessionFormData } from "../schemas";
import { SessionCappingStrategyRadio } from "./SessionCappingStrategyRadio";
import { SessionPartnershipChips } from "./SessionPartnershipChips";
import { SessionPartnershipOffersTable } from "./SessionPartnershipOffersTable";
import { SessionPartnershipToggleField } from "./SessionPartnershipToggleField";

export const SessionPartnershipSettings: FC<{
  fieldIdPrefix: string;
  isEditMode?: boolean;
}> = ({ fieldIdPrefix, isEditMode = false }) => {
  const companyTheme = dataAccessLayer.useCompanyTheme();

  const { watch } = useFormContext<SessionFormData>();

  const isPartnershipAvailable = watch("available_on_partnership");
  const cappingStrategy = watch("partner_spot_capping_strategy");

  const { activeAccounts } = useCappingDefaultValue({ isEditMode });

  if (!companyTheme?.has_partnership) return null;

  return (
    <>
      <SessionPartnershipToggleField fieldIdPrefix={fieldIdPrefix} />
      {isPartnershipAvailable && (
        <div className="ml-xl">
          <SessionCappingStrategyRadio fieldIdPrefix={fieldIdPrefix} />

          {cappingStrategy === PartnerSpotCappingStrategy.PER_PARTNER ? (
            <SessionPartnershipOffersTable
              activeAccounts={activeAccounts}
              fieldIdPrefix={fieldIdPrefix}
            />
          ) : (
            <SessionPartnershipChips
              activeAccounts={activeAccounts}
              fieldIdPrefix={fieldIdPrefix}
            />
          )}
        </div>
      )}
    </>
  );
};
