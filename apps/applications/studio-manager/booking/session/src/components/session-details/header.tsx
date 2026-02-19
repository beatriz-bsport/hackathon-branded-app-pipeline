import { FC, useId, useMemo } from "react";
import { Link } from "react-router";

import type { SessionWithActivity } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { fromIsoString, modifyTime } from "@bsport/datetime-manipulation";
import {
  Breadcrumbs,
  ChipProps,
  DetailsLayout,
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
  const { getIndexUrl } = useUrls();
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
      pageTitle={session.name_override || session.name}
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
