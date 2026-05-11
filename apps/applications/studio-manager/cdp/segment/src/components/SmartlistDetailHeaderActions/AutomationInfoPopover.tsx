import { useId } from "react";

import { Body, Title } from "@bsport/kaizen-primitive-core";

import { TimedInfoPopover } from "#src/components/timed-info-popover";
import { useTranslation } from "#src/utils/i18n";

export const AutomationInfoPopover = () => {
  const { t } = useTranslation("details");
  const popoverTitleId = useId();

  return (
    <TimedInfoPopover
      label={t("automation.infoTooltip.label")}
      placement="bottom-left"
      anchorClassName="flex items-center"
      closeDelayMs={120}
    >
      <section
        className="flex max-w-sm flex-col gap-xs p-md"
        aria-labelledby={popoverTitleId}
      >
        <Title id={popoverTitleId} htmlVariant="h4" weight="strong">
          {t("automation.infoTooltip.title")}
        </Title>
        <Body htmlVariant="p" size="md" weight="weak" color="weak">
          {t("automation.infoTooltip.body")}
        </Body>
      </section>
    </TimedInfoPopover>
  );
};
