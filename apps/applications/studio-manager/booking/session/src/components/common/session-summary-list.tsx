import React, { type Dispatch, type SetStateAction, useCallback } from "react";

import type { MinimalSession, Session } from "@bsport/api-book";
import { DATETIME_FORMATS, formatDateTime } from "@bsport/datetime-formatting";
import { List, ListItemProps } from "@bsport/kaizen-primitive-core";

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
type SessionSummaryListProps = {
  sessions: SummaryListSession[];
  originalSessionId?: number;
  isSelectable?: boolean;
  selectedIds?: string[];
  setSelectedIds?: Dispatch<SetStateAction<string[]>>;
  title?: string;
  description?: string;
  includeParticipantsCount?: boolean;
};

export const SessionSummaryList: React.FC<SessionSummaryListProps> = ({
  sessions,
  originalSessionId,
  isSelectable = false,
  selectedIds = [],
  setSelectedIds,
  title,
  description,
  includeParticipantsCount = false,
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

      const isOriginalSession = originalSessionId === session.id;
      const hasParticipantData =
        "validated_booking_count" in session && "effectif" in session;
      const hasChips = includeParticipantsCount && hasParticipantData;
      return {
        id: `${session.id}`,
        title: `${startDate} • ${startTime}`,
        disabled: !isSelectable || isOriginalSession,
        chips: hasChips
          ? [
              {
                color: "default",
                size: "lg",
                iconLeft: "users-01",
                label: `${session.validated_booking_count} / ${session.effectif}`,
                type: "weak",
              },
            ]
          : undefined,
        chipsDirection: hasChips ? "end" : undefined,
      };
    });
  }, [
    sessions,
    isSelectable,
    i18n.language,
    originalSessionId,
    includeParticipantsCount,
  ]);

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
