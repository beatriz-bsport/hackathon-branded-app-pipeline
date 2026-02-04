import { Body, Title } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/QueryBoundary";
import { useTranslation } from "#src/utils/i18n";

import { AutomationPageContent } from "./AutomationPageContent";
import { TagRulesSection } from "./TagRulesSection";

export const AutomationPage = () => {
  const { t } = useTranslation("details");

  return (
    <div className="flex flex-col gap-lg p-lg">
      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="stronger">
          {t("automation.messages.title")}
        </Title>
        <Body size="md" color="weak">
          {t("automation.messages.description")}
        </Body>
      </section>

      <QueryBoundary>
        <AutomationPageContent />
      </QueryBoundary>

      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h2" weight="stronger">
          {t("automation.tagRules.title")}
        </Title>
        <Body size="md" color="weak">
          {t("automation.tagRules.description")}
        </Body>
      </section>

      <QueryBoundary>
        <TagRulesSection />
      </QueryBoundary>
    </div>
  );
};
