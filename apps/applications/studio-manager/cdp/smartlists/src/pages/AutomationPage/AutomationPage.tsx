import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

import { Body, Card, Loader, Title } from "@bsport/kaizen-primitive-core";
import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { useTranslation } from "#src/utils/i18n";

import {
  AutomationErrorFallback,
  AutomationPageContent,
} from "./AutomationPageContent";

export const AutomationPage = () => {
  const { t } = useTranslation("details");
  const { reset } = useQueryErrorResetBoundary();

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

      <ErrorBoundaryWrapper
        appName={__SMARTLISTS__.__SENTRY_SCOPE_TAG__}
        fallback={({ resetError }) => (
          <AutomationErrorFallback
            onRetry={() => {
              reset();
              resetError();
            }}
          />
        )}
      >
        <Suspense
          fallback={
            <Card padding="none" className="overflow-hidden">
              <div className="h-[146px] grid place-items-center">
                <Loader size="lg" />
              </div>
            </Card>
          }
        >
          <AutomationPageContent />
        </Suspense>
      </ErrorBoundaryWrapper>
    </div>
  );
};
