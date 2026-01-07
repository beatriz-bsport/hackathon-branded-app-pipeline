import React from "react";

import type { MinimalSession } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { List } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type SummaryListSession = Pick<
  MinimalSession,
  "id" | "date_start" | "timezone_name"
>;
type SessionSummaryListProps = {
  sessions: SummaryListSession[];
};

export const SessionSummaryList: React.FC<SessionSummaryListProps> = ({
  sessions,
}) => {
  const { i18n } = useTranslation("common");
  return (
    <List
      id="session-summary-list"
      items={sessions.map((session) => {
        const startDate = formatDateTime(
          session.date_start,
          DATETIME_FORMATS.MEDIUM_DATE_WITH_WEEKDAY,
          { locale: i18n.language, timeZone: session.timezone_name },
        );
        const startTime = formatDateTime(
          session.date_start,
          DATETIME_FORMATS.TIME_SIMPLE,
          { locale: i18n.language, timeZone: session.timezone_name },
        );
        return {
          id: `${session.id}`,
          title: `${startDate} • ${startTime}`,
          disabled: true,
          selected: "disabled",
        };
      })}
      isCompact
    />
  );
};
