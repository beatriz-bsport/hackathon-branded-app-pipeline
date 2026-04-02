import { FC } from "react";

import { PartnerSpotCappingStrategy } from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import { SessionCapacityField } from "./SessionCapacityField";
import { SessionCappingStrategyRadio } from "./SessionCappingStrategyRadio";
import { SessionPartnershipToggleField } from "./SessionPartnershipToggleField";

export const SessionPartnershipSettings: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionCreation");

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const { watch } = useFormContext();

  const isPartnershipAvailable = watch("available_on_partnership");
  const cappingStrategy = watch("partner_spot_capping_strategy") as
    | PartnerSpotCappingStrategy
    | undefined;

  if (!companyTheme?.has_partnership) return null;

  return (
    <>
      <SessionPartnershipToggleField fieldIdPrefix={fieldIdPrefix} />
      {isPartnershipAvailable && (
        <div className="ml-xl">
          <SessionCappingStrategyRadio fieldIdPrefix={fieldIdPrefix} />
          {cappingStrategy === PartnerSpotCappingStrategy.COMBINED && (
            <SessionCapacityField
              fieldIdPrefix={fieldIdPrefix}
              label={t(
                "addSessionModal.steps.configureSession.settings.partnership.capacity.label",
              )}
              fieldName="partner_max_booking_count"
              helperText={t(
                "addSessionModal.steps.configureSession.settings.partnership.capacity.helperText",
              )}
            />
          )}
        </div>
      )}
    </>
  );
};
