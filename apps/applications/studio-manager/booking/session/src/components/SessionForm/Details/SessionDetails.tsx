import { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { type SessionVisibilityType } from "#src/events/constants";
import {
  sessionCreationCustomizeNameToggleEnabledEvent,
  sessionCreationVisibilitySelectEvent,
} from "#src/events/session-creation/events";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";

import OverrideForm from "./OverrideForm";
import { VisibilitySelector } from "./VisibilitySelector";

export const SessionDetails: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const trackOverrideToggleChange = (checked: boolean) => {
    analyticsTrackSafeEvent(sessionCreationCustomizeNameToggleEnabledEvent, {
      customize_name_toggle_enabled: checked,
    });
  };

  const trackVisibilityChange = (value: SessionVisibilityType) => {
    analyticsTrackSafeEvent(sessionCreationVisibilitySelectEvent, {
      session_visibility: value,
    });
  };

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.details.title")}
      </Title>
      <OverrideForm
        fieldIdPrefix={fieldIdPrefix}
        trackOverrideToggleChange={trackOverrideToggleChange}
      />
      <VisibilitySelector
        fieldIdPrefix={fieldIdPrefix}
        fieldName="manager_only"
        title={t(
          "addSessionModal.steps.configureSession.details.visibilitySelector.title",
        )}
        buttonClassName="min-w-component-select"
        trackVisibilityChange={trackVisibilityChange}
      />
      <Divider orientation="horizontal" weight="thin" className="my-xl" />
    </section>
  );
};
