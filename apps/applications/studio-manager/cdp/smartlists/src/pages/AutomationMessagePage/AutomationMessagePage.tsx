import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { type PropsWithChildren, Suspense } from "react";
import { Link, useNavigate, useParams } from "react-router";
import invariant from "tiny-invariant";

import { HTTPException } from "@bsport/fetch";
import {
  Breadcrumbs,
  DetailsLayout,
  ErrorFallback,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { useAutomatedCampaignDetailSuspenseQuery } from "#src/api/use-automated-campaign-detail";
import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export function AutomationMessagePage() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundaryWrapper
      appName={__SMARTLISTS__.__SENTRY_SCOPE_TAG__}
      fallback={({ error, resetError }) => (
        <AutomationMessageErrorFallback
          error={error}
          onRetry={() => {
            reset();
            resetError();
          }}
        />
      )}
    >
      <Suspense
        fallback={
          <CenteredContainer>
            <Loader size="xl" />
          </CenteredContainer>
        }
      >
        <AutomationMessageDetail />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
}

function AutomationMessageDetail() {
  const { t: tList } = useTranslation("list");

  const { id, messageId } = useParams<{ id: string; messageId: string }>();
  invariant(id, "Expected id param to be defined");
  invariant(messageId, "Expected messageId param to be defined");

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);
  const { data: automation } =
    useAutomatedCampaignDetailSuspenseQuery(messageId);

  const { detailsLayoutProps } = useDetailsLayout();

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id="breadcrumb-smartlists" text={tList("title")} />
    </Link>,
    <Link key="smartlist-detail-breadcrumb" to={`/${id}/automation`}>
      <Breadcrumbs.Item id="breadcrumb-smartlist-name" text={smartlist.name} />
    </Link>,
  ];

  const pageTitle = automation.title ?? "";

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <div>Automation Message Content</div>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}

type AutomationMessageErrorFallbackProps = {
  error: Error;
  onRetry: () => void;
};

function AutomationMessageErrorFallback({
  error,
  onRetry,
}: AutomationMessageErrorFallbackProps) {
  const { t } = useTranslation("details");

  const navigate = useNavigate();

  const isHttpError = error instanceof HTTPException;
  const is404 = isHttpError && error.statusCode === 404;
  const isServerError = isHttpError && error.type === "ServerError";

  if (is404) {
    return (
      <CenteredContainer>
        <ErrorFallback
          title={t("error.notFound.title")}
          subtitle={t("error.notFound.subtitle")}
          description={t("error.notFound.description")}
          actionProps={{
            label: t("error.notFound.backToListLabel"),
            onClick: () => navigate(URLS.INDEX),
          }}
        />
      </CenteredContainer>
    );
  }

  if (isServerError) {
    return (
      <CenteredContainer>
        <ErrorFallback
          title={t("error.serverError.title")}
          subtitle={t("error.serverError.subtitle")}
          description={t("error.serverError.description")}
          actionProps={{
            label: t("error.serverError.retryLabel"),
            onClick: onRetry,
          }}
        />
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <ErrorFallback actionProps={ErrorFallback.DEFAULT_ACTION_PROPS} />
    </CenteredContainer>
  );
}

function CenteredContainer({ children }: PropsWithChildren) {
  return <div className="grid place-content-center h-screen">{children}</div>;
}
