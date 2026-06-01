import type { FC } from "react";

import { Body, Card, Loader } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const InsightsPanelLoadingState: FC = () => {
  const { t } = useTranslation("default");

  return (
    <Card
      padding="none"
      className="flex min-h-[var(--iframe-min-h)] flex-col items-center justify-center gap-sm bg-surface-default-weaker border-none p-lg"
    >
      <Loader size="md" />
      <Body color="weak" size="md">
        {t("insightsPanel.loading")}
      </Body>
    </Card>
  );
};
