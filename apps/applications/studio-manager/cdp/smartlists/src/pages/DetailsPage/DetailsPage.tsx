import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { type PropsWithChildren, Suspense, useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import invariant from "tiny-invariant";

import { HTTPException } from "@bsport/fetch";
import {
  Breadcrumbs,
  DetailsLayout,
  ErrorFallback,
  Loader,
  Tabs,
  type TabsProps,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { ErrorBoundaryWrapper } from "@bsport/sm-backbone";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const DetailsPage = () => {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <ErrorBoundaryWrapper
      appName={__SMARTLISTS__.__SENTRY_SCOPE_TAG__}
      fallback={({ error, resetError }) => (
        <DetailErrorFallback
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
        <Details />
      </Suspense>
    </ErrorBoundaryWrapper>
  );
};

function Details() {
  const { t } = useTranslation("details");
  const { t: tList } = useTranslation("list");

  const { id } = useParams<{ id: string }>();
  invariant(id, "Expected id param to be defined");

  const navigate = useNavigate();
  const location = useLocation();

  const { data: smartlist } = useSmartlistDetailSuspenseQuery(id);

  const { detailsLayoutProps } = useDetailsLayout();

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={URLS.INDEX}>
      <Breadcrumbs.Item id="breadcrumb-smartlists" text={tList("title")} />
    </Link>,
  ];

  const tabsConfig_items = [
    {
      id: "smartlist-parameters-tab",
      path: "parameter",
      label: t("tabs.parameters"),
    },
    {
      id: "smartlist-campaigns-tab",
      path: "campaign",
      label: t("tabs.campaigns"),
    },
    {
      id: "smartlist-automations-tab",
      path: "automation",
      label: t("tabs.automations"),
    },
  ];

  useEffect(() => {
    const isAtBasePath = location.pathname === `/${id}`;

    if (isAtBasePath) {
      navigate("parameter", { replace: true });
    }
  }, [id, location.pathname, navigate]);

  const tabsConfig: TabsProps = {
    TabsItems: tabsConfig_items.map((tab) => (
      <NavLink to={`/${id}/${tab.path}`} id={tab.id} key={tab.id} end>
        {({ isActive }) => (
          <Tabs.Item id={tab.id} label={tab.label} isActive={isActive} />
        )}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  const pageTitle = smartlist?.name ?? "";

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        pageTabs={tabsConfig}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Outlet context={{ smartlistId: id, smartlist }} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
}

type DetailErrorFallbackProps = {
  error: Error;
  onRetry: () => void;
};

function DetailErrorFallback({ error, onRetry }: DetailErrorFallbackProps) {
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
