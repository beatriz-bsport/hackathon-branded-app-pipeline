import type { FC } from "react";

import {
  Body,
  Button,
  Card,
  Illustration,
  Title,
} from "@bsport/kaizen-primitive-core";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const InsightsPanelErrorState: FC = () => {
  const { t } = useTranslation("default");

  return (
    <Card
      padding="none"
      className="flex min-h-[var(--iframe-min-h)] flex-col items-center justify-center gap-sm bg-surface-default-weaker border-none p-lg text-center"
    >
      <Illustration name="error" size="xl" />
      <Title htmlVariant="h3" weight="stronger" color="weak">
        {t("insightsPanel.temporarilyUnavailable")}
      </Title>
      <Body color="weak" size="md" className="max-w-[480px]">
        {t("insightsPanel.errorHelp")}
      </Body>
      <Button
        className="mt-sm"
        color="main"
        iconRight="arrow-right"
        intent="default"
        label={t("insightsPanel.goToReports")}
        onClick={() => window.location.assign(LEGACY_URLS.REPORTING)}
        size="md"
      />
    </Card>
  );
};
