import { FC } from "react";

import type { MetaActivity } from "@bsport/api-book";
import { useFormContext } from "@bsport/form";
import { Alert, Body, Divider, Title } from "@bsport/kaizen-primitive-core";

import { SessionCapacityField } from "#src/components/SessionForm/Settings/SessionCapacityField";
import { SessionCreditsField } from "#src/components/SessionForm/Settings/SessionCreditField";
import { SessionPartnershipSettings } from "#src/components/SessionForm/Settings/SessionPartnershipSettings";
import { BroadcastLinkField } from "#src/components/SessionForm/Settings/broadcast-link-field";
import { LevelSelectorField } from "#src/components/SessionForm/level/level-selector-field";
import { useCreditFactor } from "#src/hooks/useCreditFactor";
import { selectSelectedGroupActivity } from "#src/stores/session-creation/selectors";
import { useSessionCreationStore } from "#src/stores/session-creation/store";
import { useTranslation } from "#src/utils/i18n";

import { SessionEditFormData } from "../SessionForm/types";

export const SettingsSection: FC<{
  fieldIdPrefix: string;
  metaActivity: MetaActivity;
}> = ({ fieldIdPrefix, metaActivity }) => {
  const { t } = useTranslation(["sessionCreation", "sessionEdit"]);

  const CREDITS_LIMIT_BEFORE_WARNING = 5;

  const {
    watch,
    formState: { dirtyFields },
  } = useFormContext<SessionEditFormData>();

  const { getCreditsDividedDisplay } = useCreditFactor();

  const isSelectedGroupActivityBroadcast = useSessionCreationStore(
    selectSelectedGroupActivity,
  )?.is_broadcast;

  const credits = watch("credits");

  const isCreditsDirty = dirtyFields.credits;

  const displayValue = Number(getCreditsDividedDisplay(credits)) || 0;

  const shouldDisplayCreditLimitWarning =
    displayValue > CREDITS_LIMIT_BEFORE_WARNING;

  const shouldDisplayBroadcastLinkField =
    metaActivity?.is_broadcast || isSelectedGroupActivityBroadcast;

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.settings.title", {
          ns: "sessionCreation",
        })}
      </Title>
      <SessionCapacityField
        fieldIdPrefix={fieldIdPrefix}
        fieldName="effectif"
        label={t("addSessionModal.steps.configureSession.settings.effectif", {
          ns: "sessionCreation",
        })}
      />
      <SessionPartnershipSettings fieldIdPrefix={fieldIdPrefix} />
      <SessionCapacityField
        fieldIdPrefix={fieldIdPrefix}
        fieldName="waiting_list_max_size"
        label={t("addSessionModal.steps.configureSession.settings.waitlist", {
          ns: "sessionCreation",
        })}
      />
      <SessionCreditsField fieldIdPrefix={fieldIdPrefix} />
      {(shouldDisplayCreditLimitWarning || isCreditsDirty) && (
        <Alert status="warning" type="weak">
          {shouldDisplayCreditLimitWarning && (
            <Body color="warning">
              {t(
                "addSessionModal.steps.configureSession.settings.credits.warning",
                { ns: "sessionCreation" },
              )}
            </Body>
          )}
          {isCreditsDirty && (
            <Body color="warning">
              {t("editSessionForm.content.creditWarning", {
                ns: "sessionEdit",
              })}
            </Body>
          )}
        </Alert>
      )}
      <LevelSelectorField fieldIdPrefix={fieldIdPrefix} />

      {shouldDisplayBroadcastLinkField && (
        <BroadcastLinkField fieldIdPrefix={fieldIdPrefix} />
      )}

      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
