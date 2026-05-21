import { Link, NavLink, Navigate, Outlet, useParams } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  Tabs,
  type TabsProps,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { SMARTLIST_APP_LINKS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { isPrebuiltSegmentId } from "./constants";

export const PrebuiltSegmentDetailPage = () => {
  const { t } = useTranslation("list");
  const { prebuiltSegmentId } = useParams<{ prebuiltSegmentId: string }>();
  const { detailsLayoutProps } = useDetailsLayout();

  if (!prebuiltSegmentId || !isPrebuiltSegmentId(prebuiltSegmentId)) {
    return <Navigate to={SMARTLIST_APP_LINKS.prebuiltIndex()} replace />;
  }

  const tabsConfig: TabsProps = {
    TabsItems: [
      <NavLink
        to={SMARTLIST_APP_LINKS.prebuiltDetailsSegment(prebuiltSegmentId)}
        id="prebuilt-segment-tab"
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
        id="prebuilt-campaigns-tab"
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

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={t(`prebuilt.segments.${prebuiltSegmentId}.title`)}
        pageTabs={tabsConfig}
        BreadcrumbsItems={breadcrumbsItems}
      />
      <DetailsLayout.Content>
        <Outlet context={{ prebuiltSegmentId }} />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

export default PrebuiltSegmentDetailPage;
