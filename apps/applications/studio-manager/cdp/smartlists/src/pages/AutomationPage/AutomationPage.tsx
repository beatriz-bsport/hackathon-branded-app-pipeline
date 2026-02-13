import { Body, Title, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { CardLoader, QueryBoundary } from "#src/components/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

import { MessagesSection } from "./MessagesSection";
import { TagRulesSection } from "./TagRulesSection";

export const AutomationPage = () => {
  const { t } = useTranslation("details");

  const isMobile = !useMatchMedia("md");

  return (
    <div className="flex flex-col gap-lg p-0 md:p-md">
      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="stronger">
          {t("automation.messages.title")}
        </Title>
        <Body size="md" color="weak">
          {t("automation.messages.description")}
        </Body>
      </section>

      <QueryBoundary>
        <MessagesSection compact={isMobile} />
      </QueryBoundary>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="stronger">
          {t("automation.tagRules.title")}
        </Title>
        <Body size="md" color="weak">
          {t("automation.tagRules.description")}
        </Body>
      </section>

      <QueryBoundary loadingFallback={<CardLoader size="lg" />}>
        <TagRulesSection compact={isMobile} />
      </QueryBoundary>
    </div>
  );
};
