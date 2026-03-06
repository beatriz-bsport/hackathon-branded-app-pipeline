import { FC } from "react";

import { useFormContext } from "@bsport/form";
import { Alert, Title } from "@bsport/kaizen-primitive-core";

import { LevelSelectorField } from "#src/components/SessionForm/level/level-selector-field";
import { SessionVisibilityType } from "#src/events/constants";
import { sessionCreationVisibilitySelectEvent } from "#src/events/session-creation/events";
import { useCreditFactor } from "#src/hooks/useCreditFactor";
import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import { useSessionCreationStore } from "#src/stores/session-creation/store";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";

import { VisibilitySelector } from "../Details/VisibilitySelector";
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

  const { watch, setValue } = useFormContext();

  const { getCreditsDividedValue } = useCreditFactor();

  const isSelectedGroupActivityBroadcast = useSessionCreationStore(
    selectSelectedGroupActivity,
  )?.is_broadcast;

  const credits = watch("credits");

  const creditValue = getCreditsDividedValue(credits) || 0;

  const trackVisibilityChange = (value: SessionVisibilityType) => {
    analyticsTrackSafeEvent(sessionCreationVisibilitySelectEvent, {
      session_visibility: value,
    });
  };

  const handleChange = (managerOnly: boolean) => {
    if (managerOnly) {
      setValue("available_on_partnership", false, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <section className="flex flex-col gap-md pb-md">
      <Title htmlVariant="h5" weight="strong">
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

      <VisibilitySelector
        fieldIdPrefix={fieldIdPrefix}
        fieldName="manager_only"
        title={t(
          "addSessionModal.steps.configureSession.details.visibilitySelector.title",
        )}
        buttonClassName="min-w-component-select"
        trackVisibilityChange={trackVisibilityChange}
        onFormChange={handleChange}
      />
    </section>
  );
};
