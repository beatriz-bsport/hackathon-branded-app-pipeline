import { useEffect } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  Tabs,
  type TabsProps,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import {
  DetailPageErrorFallback,
  PageLoader,
  QueryBoundary,
} from "#src/components/QueryBoundary";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import { invariant } from "#src/utils/invariant";

export const DetailsPage = () => {
  return (
    <QueryBoundary
      loadingFallback={<PageLoader />}
      errorFallback={(props) => <DetailPageErrorFallback {...props} />}
    >
      <Details />
    </QueryBoundary>
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
