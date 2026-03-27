import { Link, NavLink } from "react-router";

import {
  Breadcrumbs,
  ChipProps,
  type HeaderLayoutProps,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { SessionStatus } from "#src/components/session-details/constants";
import { Subtitle } from "#src/components/session-details/subtitle";
import type { DetailsHeaderSession } from "#src/types";
import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const useSessionDetailsHeaderConfig = (
  session: DetailsHeaderSession,
): Pick<
  HeaderLayoutProps,
  "pageTabs" | "BreadcrumbsItems" | "pageStatusChip" | "pageSubtitle"
> => {
  const { t } = useTranslation("sessionDetails");

  const { getBookingsManagementUrl, resolveEditPath, getIndexUrl } = useUrls();

  const { id } = session;

  const TABS_CONFIG = [
    {
      id: "session-management-view-tab",
      href: getBookingsManagementUrl(id),
      label: t("tabs.overview"),
      end: true, // :id => active is true | :id/anything-else => active is false
    },
    {
      id: "session-edition-view-tab",
      href: resolveEditPath(id),
      label: t("tabs.editor"),
    },
  ];

  const pageTabs: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => {
      const { end, id, href, label } = tab;
      return (
        <NavLink to={href} id={id} key={id} end={end}>
          {({ isActive }) => (
            <Tabs.Item id={id} label={label} isActive={isActive} />
          )}
        </NavLink>
      );
    }),
    orientation: "horizontal",
  };

  const sessionStatus = !session.available
    ? SessionStatus.CANCELLED
    : session.manager_only
      ? SessionStatus.UNLISTED
      : SessionStatus.LISTED;

  const statusChips: Record<SessionStatus, ChipProps> = {
    [SessionStatus.CANCELLED]: {
      color: "critical",
      size: "lg",
      type: "weak",
      label: t("header.cancelledSessionChip"),
    },
    [SessionStatus.LISTED]: {
      color: "main",
      size: "lg",
      type: "weak",
      label: t("header.listedSessionChip"),
    },
    [SessionStatus.UNLISTED]: {
      color: "default",
      size: "lg",
      type: "weak",
      label: t("header.unlistedSessionChip"),
    },
  };

  const pageStatusChip = statusChips[sessionStatus];

  const BreadcrumbsItems = [
    <Link key="link-to-calendar" to={getIndexUrl()}>
      <Breadcrumbs.Item text={t("header.breadcrumbs")} />
    </Link>,
  ];

  const pageSubtitle = <Subtitle {...session} />;

  return { pageTabs, BreadcrumbsItems, pageStatusChip, pageSubtitle };
};
