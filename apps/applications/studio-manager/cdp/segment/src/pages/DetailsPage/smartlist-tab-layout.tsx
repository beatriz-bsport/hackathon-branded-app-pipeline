import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";

import {
  Breadcrumbs,
  DetailsLayout,
  type HeaderLayoutProps,
  ListLayout,
  Tabs,
  type TabsProps,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useSmartlistDetailSuspenseQuery } from "#src/api/use-smartlist-detail";
import { SMARTLIST_APP_LINKS } from "#src/urls";
import {
  AUTOMATION_TAB_PATH,
  CAMPAIGN_TAB_PATH,
  PARAMETER_TAB_PATH,
} from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

type SmartlistTabLayoutProps = {
  children: ReactNode;
  layout: "details" | "list";
  smartlistId: string;
  endGroupActions?: HeaderLayoutProps["endGroupActions"];
  callToActionButton?: HeaderLayoutProps["callToActionButton"];
};

export const useSmartlistPageHeader = (smartlistId: string) => {
  const { t } = useTranslation(["details", "list"]);
  const { data: smartlist } = useSmartlistDetailSuspenseQuery(smartlistId);

  const tabsConfig: TabsProps = {
    TabsItems: [
      <NavLink
        to={SMARTLIST_APP_LINKS.detailsTab(smartlistId, PARAMETER_TAB_PATH)}
        id="smartlist-parameters-tab"
        key="smartlist-parameters-tab"
        end
      >
        {({ isActive }) => (
          <Tabs.Item
            id="smartlist-parameters-tab"
            label={t("tabs.parameters", { ns: "details" })}
            isActive={isActive}
          />
        )}
      </NavLink>,
      <NavLink
        to={SMARTLIST_APP_LINKS.detailsTab(smartlistId, CAMPAIGN_TAB_PATH)}
        id="smartlist-campaigns-tab"
        key="smartlist-campaigns-tab"
        end
      >
        {({ isActive }) => (
          <Tabs.Item
            id="smartlist-campaigns-tab"
            label={t("tabs.campaigns", { ns: "details" })}
            isActive={isActive}
          />
        )}
      </NavLink>,
      <NavLink
        to={SMARTLIST_APP_LINKS.detailsTab(smartlistId, AUTOMATION_TAB_PATH)}
        id="smartlist-automations-tab"
        key="smartlist-automations-tab"
        end
      >
        {({ isActive }) => (
          <Tabs.Item
            id="smartlist-automations-tab"
            label={t("tabs.automations", { ns: "details" })}
            isActive={isActive}
          />
        )}
      </NavLink>,
    ],
    orientation: "horizontal",
  };

  const breadcrumbsItems = [
    <Link key="smartlists-breadcrumb" to={SMARTLIST_APP_LINKS.index()}>
      <Breadcrumbs.Item
        id="breadcrumb-smartlists"
        text={t("title", { ns: "list" })}
      />
    </Link>,
  ];

  const pageTitle = smartlist?.name ?? "";

  return {
    breadcrumbsItems,
    pageTitle,
    tabsConfig,
  };
};

export const SmartlistTabLayout = ({
  children,
  layout,
  smartlistId,
  endGroupActions,
  callToActionButton,
}: SmartlistTabLayoutProps) => {
  const { detailsLayoutProps } = useDetailsLayout();
  const { breadcrumbsItems, pageTitle, tabsConfig } =
    useSmartlistPageHeader(smartlistId);

  if (layout === "list") {
    return (
      <ListLayout>
        <ListLayout.Header
          pageTitle={pageTitle}
          pageTabs={tabsConfig}
          BreadcrumbsItems={breadcrumbsItems}
          endGroupActions={endGroupActions}
          callToActionButton={callToActionButton}
        />
        <ListLayout.Content className="flex flex-col">
          {children}
        </ListLayout.Content>
      </ListLayout>
    );
  }

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        pageTabs={tabsConfig}
        BreadcrumbsItems={breadcrumbsItems}
        endGroupActions={endGroupActions}
        callToActionButton={callToActionButton}
      />
      <DetailsLayout.Content>{children}</DetailsLayout.Content>
    </DetailsLayout>
  );
};
