import { Link, NavLink } from "react-router";

import {
  Breadcrumbs,
  type HeaderLayoutProps,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

/**
 * Generate the shared configs of the Header in the Details pages (Overview and Editor)
 * - Tabs configuration for the Details Header
 * - Visibility chip
 * - Breadcrumbs
 */
export const useDetailsHeaderConfigs = ({
  id,
  hidden,
}: {
  id: number;
  hidden: boolean;
}): Pick<
  HeaderLayoutProps,
  "pageStatusBadge" | "pageTabs" | "BreadcrumbsItems"
> => {
  const { t } = useTranslation("details");

  // ----- Tabs navigator -----

  const TABS_CONFIG = [
    {
      id: "pack-details-editor-view-tab",
      href: URLS.DETAILS(id),
      label: t("detailsPage.tabs.editor"),
      end: true, // :id => active is true | :id/anything-else => active is false
    },
    {
      id: "pack-details-overview-view-tab",
      href: URLS.OVERVIEW(id),
      label: t("detailsPage.tabs.overview"),
    },
  ];

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

  const visibilityBadge = hidden
    ? t(
        "formFields.visibilitySection.visibilitySelector.options.hidden.shortTitle",
      )
    : t(
        "formFields.visibilitySection.visibilitySelector.options.visible.shortTitle",
      );

  const statusBadge = {
    color: hidden ? "default" : "main",
    size: "lg",
    text: visibilityBadge,
  } as const;

  // ----- Breadcrumbs -----

  const breadcrumbs = [
    <Link key="to-packs-list" to={URLS.INDEX}>
      <Breadcrumbs.Item text={t("detailsPage.packsBreadcrumbs")} />
    </Link>,
  ];

  return {
    BreadcrumbsItems: breadcrumbs,
    pageStatusBadge: statusBadge,
    pageTabs: tabsConfig,
  };
};
