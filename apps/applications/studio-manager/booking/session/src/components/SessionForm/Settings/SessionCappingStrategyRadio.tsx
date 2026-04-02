import { FC, useMemo } from "react";

import { PartnerSpotCappingStrategy } from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { RadioGroup } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const SessionCappingStrategyRadio: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");
  const { watch, setValue } = useFormContext();

  const cappingStrategy = watch("partner_spot_capping_strategy") as
    | PartnerSpotCappingStrategy
    | undefined;

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
    <div className="p-md bg-surface-default-weakest mb-md">
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
  );
};
