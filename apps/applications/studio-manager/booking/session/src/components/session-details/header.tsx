import { FC, useId, useMemo } from "react";
import { Link, NavLink } from "react-router";

import type { SessionWithActivity } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fromIsoString, modifyTime } from "@bsport/datetime-manipulation";
import {
  Breadcrumbs,
  ChipProps,
  DetailsLayout,
  Tabs,
  TabsProps,
} from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { formatMinutes } from "#src/utils/format-minutes";
import { useTranslation } from "#src/utils/i18n";

import { ShortcutActionsButton } from "../update-session-form/shortcut-actions-button";
import { SessionStatus } from "./constants";

export const Header: FC<{
  session: SessionWithActivity;
  onOpenCancelSessionModal: () => void;
  onOpenDuplicateSessionModal: () => void;
  onOpenRestoreSessionModal: () => void;
}> = ({
  session,
  onOpenCancelSessionModal,
  onOpenDuplicateSessionModal,
  onOpenRestoreSessionModal,
}) => {
  const { t, i18n } = useTranslation("sessionDetails");
  const { getEditUrl, getIndexUrl } = useUrls();
  const locale = i18n?.language;

  const subtitle = useMemo(() => {
    const formatOptions = {
      locale,
      timeZone: session.timezone_name,
    };

    const date = formatDateTime(
      session.date_start,
      DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
      formatOptions,
    );

    const startTime = formatDateTime(
      session.date_start,
      DATETIME_FORMATS.TIME_SIMPLE,
      formatOptions,
    );

    const startDateTime = fromIsoString(session.date_start, {
      zone: session.timezone_name,
    });

    const endDateTime = modifyTime({
      datetime: startDateTime,
      duration: { minute: session.duration_minute },
      operator: "plus",
    });

    const spanMultipleDays =
      startDateTime.toISODate() !== endDateTime.toISODate();

    if (spanMultipleDays) {
      return t("header.subtitleMultiDay", {
        date,
        startTime,
        duration: formatMinutes(session.duration_minute, t),
      });
    }

    const endTime = endDateTime.toISO()
      ? formatDateTime(
          endDateTime.toISO()!,
          DATETIME_FORMATS.TIME_SIMPLE,
          formatOptions,
        )
      : "";

    return t("header.subtitle", {
      date,
      startTime,
      endTime,
      duration: session.duration_minute,
    });
  }, [
    session.date_start,
    session.duration_minute,
    session.timezone_name,
    locale,
    t,
  ]);

  const TABS_CONFIG = [
    {
      id: "session-details-editor-view-tab",
      to: getEditUrl(session.id),
      label: t("tabs.editor"),
    },
  ];

  const tabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map(({ id, to, label }) => (
      <NavLink to={to} id={id} key={id} end={true}>
        {({ isActive }) => (
          <Tabs.Item id={id} label={label} isActive={isActive} />
        )}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  const sessionStatus = !session.available
    ? SessionStatus.CANCELLED
    : session.manager_only
      ? SessionStatus.UNLISTED
      : SessionStatus.LISTED;

  const statusChips: Record<string, ChipProps> = {
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

  const breadcrumbs = [
    <Link key="to-session-list" to={getIndexUrl()}>
      <Breadcrumbs.Item text={t("header.breadcrumbs")} />
    </Link>,
  ];

  const key = useId();

  return (
    <DetailsLayout.Header
      // TODO: replace with watch(<session name field>) when the form is implemented
      pageTitle={session.name_override || session.name}
      pageTabs={tabsConfig}
      pageStatusChip={statusChips[sessionStatus]}
      pageSubtitle={subtitle}
      BreadcrumbsItems={breadcrumbs}
      endGroupActions={[
        <ShortcutActionsButton
          onOpenCancelSessionModal={onOpenCancelSessionModal}
          onOpenDuplicateSessionModal={onOpenDuplicateSessionModal}
          onOpenRestoreSessionModal={onOpenRestoreSessionModal}
          session={session}
          key={key}
        />,
      ]}
    />
  );
};
