import { FC, useMemo } from "react";

import {
  ActivePartnershipAccount,
  PartnerSpotCappingStrategy,
} from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { Alert, Label, RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import {
  UPSELL_CLASSPASS_IDENTIFIER,
  useCheckCompanyAddOn,
} from "#src/utils/permission";

import { SessionFormData } from "../schemas";
import { SessionCapacityField } from "./SessionCapacityField";
import { SessionPartnershipOffersTable } from "./SessionPartnershipOffersTable";

export const SessionCappingStrategyRadio: FC<{
  fieldIdPrefix: string;
  activeAccounts?: ActivePartnershipAccount[];
}> = ({ fieldIdPrefix, activeAccounts }) => {
  const { t } = useTranslation("sessionCreation");
  const { watch, setValue } = useFormContext<SessionFormData>();

  const hasClasspass = useCheckCompanyAddOn(UPSELL_CLASSPASS_IDENTIFIER);

  const cappingStrategy = watch("partner_spot_capping_strategy");

  const options = useMemo(
    () => [
      {
        label: t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.UNLIMITED.label",
        ),
        helperText: t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.UNLIMITED.helperText",
        ),
        value: PartnerSpotCappingStrategy.UNLIMITED,
      },
      {
        label: t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.COMBINED.label",
        ),
        helperText: t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.COMBINED.helperText",
        ),
        value: PartnerSpotCappingStrategy.COMBINED,
      },
      {
        label: t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.PER_PARTNER.label",
        ),
        helperText: t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.PER_PARTNER.helperText",
        ),
        value: PartnerSpotCappingStrategy.PER_PARTNER,
      },
    ],
    [t],
  );

  return (
    <div className="mt-md">
      <Label
        htmlFor={`${fieldIdPrefix}-session-capping-strategy`}
        label={t(
          "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.label",
        )}
      />
      <div className="p-md bg-surface-default-weakest mb-md mt-sm">
        <RadioGroup
          direction="start"
          id={`${fieldIdPrefix}-session-capping-strategy`}
          onChange={(event) => {
            setValue(
              "partner_spot_capping_strategy",
              event.target.value as PartnerSpotCappingStrategy,
              { shouldDirty: true },
            );
          }}
          options={options}
          value={cappingStrategy ?? PartnerSpotCappingStrategy.COMBINED}
        >
          {(cappingStrategy === PartnerSpotCappingStrategy.COMBINED ||
            cappingStrategy === PartnerSpotCappingStrategy.PER_PARTNER) && (
            <div className="mt-md ml-lg mb-sm">
              {hasClasspass && (
                <Alert
                  layout="banner"
                  status="warning"
                  type="weak"
                  className="p-xs mb-sm"
                >
                  {t(
                    "addSessionModal.steps.configureSession.settings.partnership.capacity.classpassInfo",
                  )}
                </Alert>
              )}
              {cappingStrategy === PartnerSpotCappingStrategy.COMBINED && (
                <div className="flex items-end gap-sm">
                  <SessionCapacityField
                    fieldIdPrefix={fieldIdPrefix}
                    label={t(
                      "addSessionModal.steps.configureSession.settings.partnership.capacity.label",
                    )}
                    fieldName="partner_max_booking_count"
                  />
                </div>
              )}
              {cappingStrategy === PartnerSpotCappingStrategy.PER_PARTNER && (
                <SessionPartnershipOffersTable
                  activeAccounts={activeAccounts}
                  fieldIdPrefix={fieldIdPrefix}
                />
              )}
            </div>
          )}
        </RadioGroup>
      </div>
    </div>
  );
};
