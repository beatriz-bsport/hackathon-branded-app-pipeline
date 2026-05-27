import type { ReactNode } from "react";
import { Link, NavLink, Navigate, Outlet, useParams } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  ListLayout,
  Tabs,
  type TabsProps,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { type PrebuiltSegmentId, isPrebuiltSegmentId } from "./constants";
import { usePrebuiltSegmentDefinition } from "./prebuilt-segment-mocks";

export type PrebuiltSegmentDetailOutletContext = {
  prebuiltSegmentId: PrebuiltSegmentId;
};

type PrebuiltSegmentTabLayoutProps = {
  children: ReactNode;
  layout: "details" | "list";
  prebuiltSegmentId: PrebuiltSegmentId;
};

export const usePrebuiltSegmentPageHeader = (
  prebuiltSegmentId: PrebuiltSegmentId,
) => {
  const { t } = useTranslation("list");
  const definition = usePrebuiltSegmentDefinition(prebuiltSegmentId);

  const tabsConfig: TabsProps = {
    TabsItems: [
      <NavLink
        to={SMARTLIST_APP_LINKS.prebuiltDetailsSegment(prebuiltSegmentId)}
        key="prebuilt-segment-tab"
        end
      >
        {({ isActive }) => (
          <Tabs.Item
            label={t("prebuilt.details.tabs.segment")}
            isActive={isActive}
            id="prebuilt-segment-tab"
          />
        )}
      </NavLink>,
      <NavLink
        to={SMARTLIST_APP_LINKS.prebuiltDetailsCampaigns(prebuiltSegmentId)}
        key="prebuilt-campaigns-tab"
        end
      >
        {({ isActive }) => (
          <Tabs.Item
            label={t("prebuilt.details.tabs.campaigns")}
            isActive={isActive}
            id="prebuilt-campaigns-tab"
          />
        )}
      </NavLink>,
    ],
    orientation: "horizontal",
  };

  const breadcrumbsItems = [
    <Link
      key="prebuilt-segments-breadcrumb"
      to={SMARTLIST_APP_LINKS.prebuiltIndex()}
    >
      <Breadcrumbs.Item
        id="breadcrumb-prebuilt-segments"
        text={t("tabs.prebuilt")}
      />
    </Link>,
  ];

  const pageTitle = t(`prebuilt.segments.${prebuiltSegmentId}.title`, {
    defaultValue: definition.fallback_title,
  });

  return {
    breadcrumbsItems,
    pageTitle,
    tabsConfig,
  };
};

export const PrebuiltSegmentTabLayout = ({
  children,
  layout,
  prebuiltSegmentId,
}: PrebuiltSegmentTabLayoutProps) => {
  const { detailsLayoutProps } = useDetailsLayout();
  const { breadcrumbsItems, pageTitle, tabsConfig } =
    usePrebuiltSegmentPageHeader(prebuiltSegmentId);

  if (layout === "list") {
    return (
      <ListLayout>
        <ListLayout.Header
          pageTitle={pageTitle}
          pageTabs={tabsConfig}
          BreadcrumbsItems={breadcrumbsItems}
        />
        <ListLayout.Content>{children}</ListLayout.Content>
      </ListLayout>
    );
  }

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        pageTabs={tabsConfig}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>{children}</DetailsLayout.Content>
    </DetailsLayout>
  );
};

export const PrebuiltSegmentDetailPage = () => {
  const { prebuiltSegmentId: prebuiltSegmentIdParam } = useParams<{
    prebuiltSegmentId: string;
  }>();

  if (!prebuiltSegmentIdParam || !isPrebuiltSegmentId(prebuiltSegmentIdParam)) {
    return <Navigate to={SMARTLIST_APP_LINKS.prebuiltIndex()} replace />;
  }

  const prebuiltSegmentId = prebuiltSegmentIdParam;

  return <Outlet context={{ prebuiltSegmentId }} />;
};

export default PrebuiltSegmentDetailPage;
