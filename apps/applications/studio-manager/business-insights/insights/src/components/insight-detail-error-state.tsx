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

export const InsightDetailErrorState: FC = () => {
  const { t } = useTranslation("insights");

  return (
    <Card
      padding="none"
      className="flex h-full w-full flex-col items-center justify-center gap-sm overflow-y-auto border-none bg-surface-default p-lg text-center"
    >
      <Illustration name="error" size="xl" />
      <Title htmlVariant="h3" weight="stronger" color="weak">
        {t("detail.error.title")}
      </Title>
      <Body color="weak" size="md" className="max-w-[480px]">
        {t("detail.error.help")}
      </Body>
      <Button
        className="mt-sm"
        color="main"
        iconRight="arrow-right"
        intent="default"
        label={t("detail.error.goToReports")}
        onClick={() => window.location.assign(LEGACY_URLS.REPORTING)}
        size="md"
      />
    </Card>
  );
};
