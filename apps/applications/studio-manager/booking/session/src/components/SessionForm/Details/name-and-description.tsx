import clsx from "clsx";
import { FC } from "react";

import {
  Body,
  Card,
  Icon,
  Title,
  Tooltip,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { sessionCreationCustomizeNameToggleEnabledEvent } from "#src/events/session-creation/events";
import { analyticsTrackSafeEvent } from "#src/utils/analytics-track-safe-event";
import { useTranslation } from "#src/utils/i18n";

import OverrideForm from "./OverrideForm";

const SectionTitle: FC = () => {
  const { t } = useTranslation("sessionCreation");
  const isMobile = !useMatchMedia("lg");
  return (
    <div
      className={clsx("flex", {
        "items-center gap-xs": !isMobile,
        "flex-col gap-sm": isMobile,
      })}
    >
      <Title htmlVariant="h5" weight="strong">
        {t("addSessionModal.steps.configureSession.nameAndDescription")}
      </Title>
      {isMobile ? (
        <Body size="sm" weight="weaker">
          {t(
            "addSessionModal.steps.configureSession.nameAndDescriptionHelperText",
          )}
        </Body>
      ) : (
        <Tooltip
          label={t(
            "addSessionModal.steps.configureSession.nameAndDescriptionHelperText",
          )}
          placement="bottom"
        >
          <Icon
            icon="info-circle"
            size="sm"
            className="text-onsurface-action-weak-default"
          />
        </Tooltip>
      )}
    </div>
  );
};

export const NameAndDescription: FC<{
  fieldIdPrefix: string;
}> = ({ fieldIdPrefix }) => {
  const trackOverrideToggleChange = (checked: boolean) => {
    analyticsTrackSafeEvent(sessionCreationCustomizeNameToggleEnabledEvent, {
      customize_name_toggle_enabled: checked,
    });
  };

  return (
    <section className="flex flex-col gap-md">
      <SectionTitle />
      <Card className="bg-surface-page-navigation">
        <OverrideForm
          fieldIdPrefix={fieldIdPrefix}
          trackOverrideToggleChange={trackOverrideToggleChange}
        />
      </Card>
    </section>
  );
};
