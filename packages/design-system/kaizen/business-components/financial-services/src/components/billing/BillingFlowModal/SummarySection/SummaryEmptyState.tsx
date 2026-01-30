import React from "react";

import { Body, Illustration, Title } from "@bsport/kaizen-primitive-core";

import { useKaizenI18nInstance, useTranslation } from "#src/i18n";

// TODO: Check with design team why EmptyState is not used in Card component
// This is temporary and duplicated to avoid changing kaizen primitive core package
export const SummaryEmptyState: React.FC = () => {
  const i18nInstance = useKaizenI18nInstance();
  const { t } = useTranslation("default", { i18n: i18nInstance });

  return (
    <div className="h-full py-xl flex flex-col gap-xs items-center justify-center">
      <Illustration name="empty" />
      <Title
        htmlVariant="h3"
        weight="stronger"
        color="weak"
        className="text-center"
      >
        {t("billingFlowModal.emptyState.title")}
      </Title>
      <Body
        htmlVariant="p"
        weight="weak"
        color="weak"
        className="text-center"
        size="lg"
      >
        {t("billingFlowModal.emptyState.subtitle")}
      </Body>
    </div>
  );
};
