import { Link, NavLink } from "react-router";

import { useVisibilityBadgeConfig } from "@bsport/kaizen-business-components/buyables/visibility-selector";
import {
  Breadcrumbs,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { URLS, getHrefFromRoot } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

/**
 * Provide the root elements of the header for the different details page (editor, overview, pauses)
 */
export const useContractDetailsHeader = ({
  id,
  isVisible,
}: {
  id: number;
  isVisible?: boolean;
}) => {
  const { t } = useTranslation("contract-details");

  // ----- Tabs navigator -----

  const TABS_CONFIG = [
    {
      id: "contract-details-view-tab-editor",
      href: URLS.EDITOR(id),
      label: t("header.tabs.editor"),
      end: true, // :id => active is true | :id/anything-else => active is false
    },
    {
      id: "contract-details-view-tab-overview",
      href: URLS.OVERVIEW(id),
      label: t("header.tabs.overview"),
    },
    {
      id: "contract-details-view-tab-pauses",
      href: URLS.PAUSES(id),
      label: t("header.tabs.pauses"),
    },
  ];

  const tabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => {
      const { end, id, href, label } = tab;
      return (
        <NavLink to={getHrefFromRoot(href)} id={id} key={id} end={end}>
          {({ isActive }) => (
            <Tabs.Item id={id} label={label} isActive={isActive} />
          )}
        </NavLink>
      );
    }),
    orientation: "horizontal",
  };

  // ----- Visibility chip -----

  const statusBadge = useVisibilityBadgeConfig(!!isVisible);

  // ----- Breadcrumbs -----

  const breadcrumbs = [
    <Link key="link-to-contract-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("header.breadcrumbs.contracts")} />
    </Link>,
  ];

  return {
    BreadcrumbsItems: breadcrumbs,
    pageStatusBadge: statusBadge,
    pageTabs: tabsConfig,
  };
};
