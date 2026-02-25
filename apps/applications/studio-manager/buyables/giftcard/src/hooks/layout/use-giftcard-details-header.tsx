import { Link, NavLink } from "react-router";

import { useVisibilityBadgeConfig } from "@bsport/kaizen-business-components/buyables/visibility-selector";
import {
  Breadcrumbs,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

/**
 *
 * Provide the root elements of the header for the different details page (editor, purchases)
 */
export const useGiftcardDetailsHeader = ({
  id,
  isVisible,
}: {
  id?: number;
  isVisible?: boolean;
}) => {
  const { t } = useTranslation("giftcard-details");

  // ----- Tabs navigator -----

  const TABS_CONFIG = id
    ? [
        {
          id: "giftcard-details-view-tab-editor",
          href: URLS.EDITOR(id),
          label: t("details.header.tabs.editor"),
          end: true, // :id => active is true | :id/anything-else => active is false
        },
        {
          id: "giftcard-details-view-tab-purchases",
          href: URLS.PURCHASES(id),
          label: t("details.header.tabs.purchases"),
        },
      ]
    : [];

  const tabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => {
      const { end, id, href, label } = tab;
      return (
        <NavLink to={`../${href}`} id={id} key={id} end={end}>
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
    <Link key="link-to-giftcard-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("details.header.breadcrumbs")} />
    </Link>,
  ];

  return {
    BreadcrumbsItems: breadcrumbs,
    pageStatusBadge: statusBadge,
    pageTabs: tabsConfig,
  };
};
