// DUPLICATE OF: apps/applications/studio-manager/booking/session/src/components/common/session-summary-list.tsx
import React, { type Dispatch, type SetStateAction, useCallback } from "react";

import type { MinimalSession, Session } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { List, type ListItemProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

type SummaryListSession =
  | Pick<MinimalSession, "id" | "date_start" | "timezone_name">
  | Pick<
      Session,
      | "id"
      | "date_start"
      | "timezone_name"
      | "validated_booking_count"
      | "effectif"
    >;

type Props = {
  sessions: SummaryListSession[];
  originalSessionId?: number;
  isSelectable?: boolean;
  selectedIds?: string[];
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
  title?: string;
  listId?: string;
};

export const SessionSummaryList: React.FC<Props> = ({
  sessions,
  originalSessionId,
  isSelectable = false,
  selectedIds = [],
  setSelectedIds,
  title,
  listId = "wellhub-session-summary-list",
}) => {
  const { i18n } = useTranslation("common");

  const getItems = useCallback((): ListItemProps[] => {
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
      return {
        id: `${session.id}`,
        title: `${startDate} • ${startTime}`,
        disabled: !isSelectable || originalSessionId === session.id,
      };
    });
  }, [sessions, isSelectable, i18n.language, originalSessionId]);

  return (
    <List
      id={listId}
      items={getItems()}
      header={title ? { title } : undefined}
      isSelectable={isSelectable}
      isCompact
      checkedIds={selectedIds}
      setCheckedIds={setSelectedIds}
    />
  );
};
