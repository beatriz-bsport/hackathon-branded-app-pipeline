import React, { useCallback, useEffect } from "react";

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
  originalSessionId?: number;
  isSelectable?: boolean;
  title?: string;
  description?: string;
  initialSelectAll?: boolean;
};

export const SessionSummaryList: React.FC<SessionSummaryListProps> = ({
  sessions,
  originalSessionId,
  isSelectable = false,
  initialSelectAll = false,
  title,
  description,
}) => {
  const { i18n } = useTranslation("common");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const getInitialSelectedIds = useCallback(() => {
    if (!isSelectable) {
      return [];
    }
    if (!initialSelectAll) {
      return [`${originalSessionId}`];
    }
    return sessions.map((session) => `${session.id}`);
  }, [isSelectable, sessions, originalSessionId, initialSelectAll]);

  const getItems = useCallback(() => {
    return sessions.map((session) => {
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

      const isOriginalSession = originalSessionId === session.id;
      return {
        id: `${session.id}`,
        title: `${startDate} • ${startTime}`,
        disabled: !isSelectable || isOriginalSession,
      };
    });
  }, [sessions, isSelectable, i18n.language, originalSessionId]);

  useEffect(() => {
    setSelectedIds(getInitialSelectedIds());
  }, [getInitialSelectedIds]);

  return (
    <List
      id="session-summary-list"
      items={getItems()}
      header={title || description ? { title, description } : undefined}
      isSelectable={isSelectable}
      isCompact
      checkedIds={selectedIds}
      setCheckedIds={setSelectedIds}
    />
  );
};
