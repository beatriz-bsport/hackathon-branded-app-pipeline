import React, { memo } from "react";

import { fromIsoString } from "@bsport/datetime-manipulation";

import type { EnrichedSession } from "../../stores/session-list/types";
import { SessionDayTitle } from "./SessionDayTitle";
import { SessionTable } from "./SessionTable";

type SessionDayProps = {
  date: string;
  sessions: EnrichedSession[];
  isLoading: boolean;
  locale: string;
};

export const SessionDay: React.FC<SessionDayProps> = memo(
  ({ date, sessions, isLoading, locale }: SessionDayProps) => {
    const localizedDate = fromIsoString(date, {
      locale: locale,
    });
    return (
      <div>
        <SessionDayTitle date={localizedDate} sessions={sessions} />
        <SessionTable sessions={sessions} isLoading={isLoading} />
      </div>
    );
  },
);

SessionDay.displayName = "SessionDay";
