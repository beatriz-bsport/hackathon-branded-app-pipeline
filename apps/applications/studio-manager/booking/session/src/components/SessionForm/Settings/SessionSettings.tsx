import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert, Divider, Title } from "@bsport/kaizen-primitive-core";

import { LevelSelectorField } from "#src/components/SessionForm/level/level-selector-field";
import { useCreditFactor } from "#src/hooks/useCreditFactor";
import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import { useSessionCreationStore } from "#src/stores/session-creation/store";
import { useTranslation } from "#src/utils/i18n";

import { SessionCapacityField } from "./SessionCapacityField";
import { SessionCreditsField } from "./SessionCreditField";
import { SessionPartnershipSettings } from "./SessionPartnershipSettings";
import { BroadcastLinkField } from "./broadcast-link-field";
import { HybridSessionField } from "./hybrid-session-field";

export const SessionSettings: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const CREDITS_LIMIT_BEFORE_WARNING = 5;

  const { watch } = useFormContext();

  const { getCreditsDividedValue } = useCreditFactor();

  const isSelectedGroupActivityBroadcast = useSessionCreationStore(
    selectSelectedGroupActivity,
  )?.is_broadcast;

  const credits = watch("credits");

  const creditValue = getCreditsDividedValue(credits) || 0;

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.settings.title")}
      </Title>
      <SessionCapacityField
        fieldIdPrefix={fieldIdPrefix}
        fieldName="effectif"
        label={t("addSessionModal.steps.configureSession.settings.effectif")}
      />
      <SessionPartnershipSettings fieldIdPrefix={fieldIdPrefix} />
      <SessionCapacityField
        fieldIdPrefix={fieldIdPrefix}
        fieldName="waiting_list_max_size"
        label={t("addSessionModal.steps.configureSession.settings.waitlist")}
      />
      <SessionCreditsField fieldIdPrefix={fieldIdPrefix} />
      {creditValue > CREDITS_LIMIT_BEFORE_WARNING && (
        <Alert status="warning" type="weak">
          {t("addSessionModal.steps.configureSession.settings.credits.warning")}
        </Alert>
      )}
      <LevelSelectorField fieldIdPrefix={fieldIdPrefix} />

      {!isSelectedGroupActivityBroadcast ? (
        <HybridSessionField fieldIdPrefix={fieldIdPrefix} />
      ) : (
        <BroadcastLinkField fieldIdPrefix={fieldIdPrefix} />
      )}

      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
