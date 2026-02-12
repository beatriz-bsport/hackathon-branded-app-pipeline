import { FC, useMemo } from "react";
import { NavLink } from "react-router";

import type { SessionWithActivity } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fromIsoString, modifyTime } from "@bsport/datetime-manipulation";
import {
  ChipProps,
  DetailsLayout,
  Tabs,
  TabsProps,
} from "@bsport/kaizen-primitive-core";

import { useUrls } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { SessionStatus } from "./constants";

export const Header: FC<{ session: SessionWithActivity }> = ({ session }) => {
  const { t, i18n } = useTranslation("sessionDetails");
  const { getEditUrl } = useUrls();
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

    const endDateTime = modifyTime({
      datetime: fromIsoString(session.date_start, {
        zone: session.timezone_name,
      }),
      duration: { minute: session.duration_minute },
      operator: "plus",
    });

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

  return (
    <DetailsLayout.Header
      // TODO: replace with watch(<session name field>) when the form is implemented
      pageTitle={session.name_override || session.name}
      pageTabs={tabsConfig}
      pageStatusChip={statusChips[sessionStatus]}
      pageSubtitle={subtitle}
    />
  );
};
