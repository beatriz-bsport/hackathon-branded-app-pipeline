import { useMemo } from "react";
import { Link, NavLink } from "react-router";

import type { Session } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import {
  Breadcrumbs,
  type ChipProps,
  type HeaderLayoutProps,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";
import { getCompanyTimezone } from "@bsport/timezone-utils";

import { SeriesActionsMenuButton } from "#src/components/series-actions/series-actions-menu-button";
import { SessionStatus } from "#src/components/session-details/constants";
import type { Series } from "#src/types";
import { ABSOLUTE_ROUTES, useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import {
  getSeriesNonCancelledClassBounds,
  isSeriesCancelled,
} from "#src/utils/series-detail-drawer";

export type SeriesDetailsHeaderConfig = Pick<
  HeaderLayoutProps,
  | "BreadcrumbsItems"
  | "pageStatusChip"
  | "pageSubtitle"
  | "pageTabs"
  | "pageTitle"
  | "startGroupActions"
>;

const getSeriesStatusChip = ({
  isCancelled,
  isUnlisted,
  labels,
}: {
  isCancelled: boolean;
  isUnlisted: boolean;
  labels: Record<SessionStatus, string>;
}): ChipProps => {
  if (isCancelled) {
    return {
      color: "critical",
      label: labels[SessionStatus.CANCELLED],
      size: "lg",
      type: "weak",
    };
  }

  if (isUnlisted) {
    return {
      color: "default",
      label: labels[SessionStatus.UNLISTED],
      size: "lg",
      type: "weak",
    };
  }

  return {
    color: "main",
    label: labels[SessionStatus.LISTED],
    size: "lg",
    type: "weak",
  };
};

export const useSeriesDetailsHeaderConfig = ({
  classes,
  series,
  onCancel,
  onDuplicate,
}: {
  classes: Session[];
  series: Series;
  onCancel: () => void;
  onDuplicate: () => void;
}): SeriesDetailsHeaderConfig => {
  const { t, i18n } = useTranslation("series");
  const { resolveSeriesClassesPath, resolveSeriesEditPath } = useUrls();
  const locale = i18n.language;
  const companyTimeZone =
    dataAccessLayer.useCompanyTheme()?.timezone_name ?? getCompanyTimezone();

  const classBounds = getSeriesNonCancelledClassBounds(classes);
  const isCancelled = isSeriesCancelled({ classes, series });

  const pageSubtitle =
    classBounds.firstClassDate && classBounds.lastClassDate
      ? t("header.dateRange", {
          firstDate: formatDateTime(
            classBounds.firstClassDate,
            DATETIME_FORMATS.MEDIUM_DATE,
            { locale, timeZone: companyTimeZone },
          ),
          lastDate: formatDateTime(
            classBounds.lastClassDate,
            DATETIME_FORMATS.MEDIUM_DATE,
            { locale, timeZone: companyTimeZone },
          ),
        })
      : t("header.noDateRange");

  const pageStatusChip = getSeriesStatusChip({
    isCancelled,
    isUnlisted: series.manager_only,
    labels: {
      [SessionStatus.CANCELLED]: t("header.status.cancelled"),
      [SessionStatus.LISTED]: t("header.status.listed"),
      [SessionStatus.UNLISTED]: t("header.status.unlisted"),
    },
  });

  const pageTabs: TabsProps = {
    orientation: "horizontal",
    TabsItems: [
      <NavLink key="editor" to={resolveSeriesEditPath(series.id)} end>
        {({ isActive }) => (
          <Tabs.Item
            id="series-tab-editor"
            label={t("tabs.editor")}
            isActive={isActive}
          />
        )}
      </NavLink>,
      <NavLink key="classes" to={resolveSeriesClassesPath(series.id)} end>
        {({ isActive }) => (
          <Tabs.Item
            id="series-tab-classes"
            label={t("tabs.classes", {
              count: classes.length,
            })}
            isActive={isActive}
          />
        )}
      </NavLink>,
    ],
  };

  const BreadcrumbsItems = [
    <Link key="link-to-series-list" to={ABSOLUTE_ROUTES.SERIES_LIST}>
      <Breadcrumbs.Item text={t("header.breadcrumbs")} />
    </Link>,
  ];

  const startGroupActions = useMemo(
    () => [
      <SeriesActionsMenuButton
        key="series-actions"
        labels={{
          cancel: t("header.actions.cancel"),
          duplicate: t("header.actions.duplicate"),
          menu: t("header.actions.label"),
        }}
        onCancel={isCancelled ? undefined : onCancel}
        onDuplicate={onDuplicate}
        prominent
      />,
    ],
    [isCancelled, onCancel, onDuplicate, t],
  );

  return {
    BreadcrumbsItems,
    pageStatusChip,
    pageSubtitle,
    pageTabs,
    pageTitle: series.name,
    startGroupActions,
  };
};
