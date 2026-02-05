import { FC } from "react";

import { Divider, Title } from "@bsport/kaizen-primitive-core";

import { type SessionVisibilityType } from "#src/events/constants";
import {
  sessionCreationCustomizeNameToggleEnabledEvent,
  sessionCreationVisibilitySelectEvent,
} from "#src/events/session-creation/events";
import { analyticsClient } from "#src/utils/analytics";
import { useTranslation } from "#src/utils/i18n";

import { OverrideToggle } from "./OverrideToggle";
import { SessionDescriptionField } from "./SessionDescriptionField";
import { SessionNameField } from "./SessionNameField";
import { VisibilitySelector } from "./VisibilitySelector";

export const SessionDetails: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionCreation");

  const labels = {
    visible: {
      label: t(
        "addSessionModal.steps.configureSession.details.visibilitySelector.options.visible.label",
      ),
      buttonLabel: t(
        "addSessionModal.steps.configureSession.details.visibilitySelector.options.visible.label",
      ),
      helperText: t(
        "addSessionModal.steps.configureSession.details.visibilitySelector.options.visible.description",
      ),
    },
    hidden: {
      label: t(
        "addSessionModal.steps.configureSession.details.visibilitySelector.options.hidden.label",
      ),
      buttonLabel: t(
        "addSessionModal.steps.configureSession.details.visibilitySelector.options.hidden.label",
      ),
      helperText: t(
        "addSessionModal.steps.configureSession.details.visibilitySelector.options.hidden.description",
      ),
    },
  };

  const trackOverrideToggleChange = (checked: boolean) => {
    analyticsClient.track(
      sessionCreationCustomizeNameToggleEnabledEvent({
        customize_name_toggle_enabled: checked,
      }),
    );
  };

  const trackVisibilityChange = (value: SessionVisibilityType) => {
    analyticsClient.track(
      sessionCreationVisibilitySelectEvent({
        session_visibility: value,
      }),
    );
  };

  return (
    <section className="flex flex-col gap-md">
      <Title htmlVariant="h5">
        {t("addSessionModal.steps.configureSession.details.title")}
      </Title>
      <OverrideToggle
        fieldIdPrefix={fieldIdPrefix}
        trackOverrideToggleChange={trackOverrideToggleChange}
      />
      <div className="flex flex-col gap-md ml-xl">
        <SessionNameField fieldIdPrefix={fieldIdPrefix} />
        <SessionDescriptionField fieldIdPrefix={fieldIdPrefix} />
      </div>
      <VisibilitySelector
        fieldIdPrefix={fieldIdPrefix}
        fieldName="manager_only"
        labels={labels}
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
