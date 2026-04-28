import { FC, useEffect, useMemo } from "react";

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
  const activeAccountsCount = activeAccounts?.length ?? 0;
  const hasActiveAccounts = activeAccountsCount > 0;
  const hasSingleActiveAccount = activeAccountsCount === 1;
  const shouldShowPerPartnerOption = activeAccountsCount > 1;

  useEffect(() => {
    if (
      shouldShowPerPartnerOption ||
      cappingStrategy !== PartnerSpotCappingStrategy.PER_PARTNER
    ) {
      return;
    }

    setValue(
      "partner_spot_capping_strategy",
      PartnerSpotCappingStrategy.COMBINED,
      { shouldDirty: true },
    );
  }, [cappingStrategy, setValue, shouldShowPerPartnerOption]);

  const options = useMemo(
    () =>
      [
        {
          label: t(
            "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.UNLIMITED.label",
          ),
          helperText: t(
            hasSingleActiveAccount
              ? "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.UNLIMITED.singleAggregatorHelperText"
              : "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.UNLIMITED.helperText",
          ),
          value: PartnerSpotCappingStrategy.UNLIMITED,
        },
        {
          label: t(
            hasSingleActiveAccount
              ? "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.COMBINED.singleAggregatorLabel"
              : "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.COMBINED.label",
          ),
          helperText: t(
            hasSingleActiveAccount
              ? "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.COMBINED.singleAggregatorHelperText"
              : "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.COMBINED.helperText",
          ),
          value: PartnerSpotCappingStrategy.COMBINED,
          children: (
            <>
              {hasClasspass && (
                <Alert
                  layout="banner"
                  status="info"
                  type="weak"
                  className="p-xs mb-sm"
                >
                  {t(
                    "addSessionModal.steps.configureSession.settings.partnership.capacity.classpassInfo",
                  )}
                </Alert>
              )}
              <SessionCapacityField
                fieldIdPrefix={fieldIdPrefix}
                label={t(
                  "addSessionModal.steps.configureSession.settings.partnership.capacity.label",
                )}
                fieldName="partner_max_booking_count"
              />
            </>
          ),
        },
        {
          label: t(
            "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.PER_PARTNER.label",
          ),
          helperText: t(
            "addSessionModal.steps.configureSession.settings.partnership.cappingStrategy.PER_PARTNER.helperText",
          ),
          value: PartnerSpotCappingStrategy.PER_PARTNER,
          children: (
            <SessionPartnershipOffersTable
              activeAccounts={activeAccounts}
              fieldIdPrefix={fieldIdPrefix}
            />
          ),
        },
      ].filter(
        (option) =>
          shouldShowPerPartnerOption ||
          option.value !== PartnerSpotCappingStrategy.PER_PARTNER,
      ),
    [
      t,
      hasClasspass,
      fieldIdPrefix,
      activeAccounts,
      hasSingleActiveAccount,
      shouldShowPerPartnerOption,
    ],
  );

  if (!hasActiveAccounts) return null;

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
        />
      </div>
    </div>
  );
};
