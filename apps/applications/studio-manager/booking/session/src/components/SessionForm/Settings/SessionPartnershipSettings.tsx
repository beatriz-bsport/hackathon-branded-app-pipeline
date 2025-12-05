import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import { SessionCapacityField } from "./SessionCapacityField";
import { SessionPartnershipToggleField } from "./SessionPartnershipToggleField";

export const SessionPartnershipSettings: FC<{ fieldIdPrefix: string }> = ({
  fieldIdPrefix,
}) => {
  const { t } = useTranslation("sessionCreation");

  const companyTheme = dataAccessLayer.useCompanyTheme();

  const { watch } = useFormContext();

  const isPartnershipAvailable = watch("available_on_partnership");

  if (!companyTheme?.has_partnership) return null;

  return (
    <>
      <SessionPartnershipToggleField fieldIdPrefix={fieldIdPrefix} />
      {isPartnershipAvailable && (
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
    </>
  );
};
