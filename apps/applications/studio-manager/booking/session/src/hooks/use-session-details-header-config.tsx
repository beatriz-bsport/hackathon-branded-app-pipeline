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
import { useFetchRecurrenceFromSession } from "#src/hooks/session-api/fetch/use-fetch-recurrence-from-session";
import type { DetailsHeaderSession } from "#src/types";
import { useUrls } from "#src/urls";
import {
  type SessionTabKey,
  getVisibleSessionTabs,
} from "#src/utils/get-visible-session-tabs";
import { useTranslation } from "#src/utils/i18n";

export const useSessionDetailsHeaderConfig = (
  session: DetailsHeaderSession,
): Pick<
  HeaderLayoutProps,
  "pageTabs" | "BreadcrumbsItems" | "pageStatusChip" | "pageSubtitle"
> => {
  const { t: tDetails } = useTranslation("sessionDetails");
  const { t: tManagement } = useTranslation("sessionManagement");

  const {
    getBookingsManagementPath,
    resolveEditPath,
    resolveSeriesPath,
    resolveAllOccurrencesPath,
    getIndexUrl,
  } = useUrls();

  // ----- Status chip (unchanged behaviour) -----

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
      label: tDetails("header.cancelledSessionChip"),
    },
    [SessionStatus.LISTED]: {
      color: "main",
      size: "lg",
      type: "weak",
      label: tDetails("header.listedSessionChip"),
    },
    [SessionStatus.UNLISTED]: {
      color: "default",
      size: "lg",
      type: "weak",
      label: tDetails("header.unlistedSessionChip"),
    },
  };

  const pageStatusChip = statusChips[sessionStatus];

  // ----- Breadcrumbs (unchanged behaviour) -----

  const BreadcrumbsItems = [
    <Link key="link-to-calendar" to={getIndexUrl()}>
      <Breadcrumbs.Item text={tDetails("header.breadcrumbs")} />
    </Link>,
  ];

  // ----- Subtitle (unchanged behaviour) -----

  const pageSubtitle = <Subtitle {...session} />;

  // ----- Tabs (new — replaces useSessionPageTabs) -----

  // Non-suspense: this hook also renders in the Editor header, which has no
  // Suspense boundary. Until recurrence resolves, recurrenceCount is 0 and the
  // Occurrences chip is simply absent (cosmetic; page content is route-driven).
  const { data: recurrence } = useFetchRecurrenceFromSession(session.id);

  const visibleTabs = getVisibleSessionTabs(
    session.group,
    recurrence?.recurrence_count ?? 0,
  );

  const hrefByKey: Record<SessionTabKey, string> = {
    overview: getBookingsManagementPath(session.id),
    editor: resolveEditPath(session.id),
    series: resolveSeriesPath(session.id),
    occurrences: resolveAllOccurrencesPath(session.id),
  };

  const pageTabs: TabsProps = {
    orientation: "horizontal",
    TabsItems: visibleTabs.map((key) => (
      <NavLink key={key} to={hrefByKey[key]} end={key === "overview"}>
        {({ isActive }) => (
          <Tabs.Item
            id={`session-tab-${key}`}
            label={tManagement(`pageTabs.${key}`)}
            isActive={isActive}
          />
        )}
      </NavLink>
    )),
  };

  return { pageTabs, BreadcrumbsItems, pageStatusChip, pageSubtitle };
};
