import React, { memo } from "react";

import { fromIsoString } from "@bsport/datetime-manipulation";

import CalendarDay from "#src/components/shared/CalendarDay";

import type { EnrichedSession } from "../../types";
import SessionDayTitle from "./SessionDayTitle";
import SessionTable from "./SessionTable";

type SessionDayProps = {
  date: string;
  sessions: EnrichedSession[];
  locale: string;
};

const SessionDay: React.FC<SessionDayProps> = ({
  date,
  sessions,
  locale,
}: SessionDayProps) => {
  const localizedDate = fromIsoString(date, {
    locale: locale,
  });
  return (
    <CalendarDay date={date}>
      <SessionDayTitle date={localizedDate} sessions={sessions} />
      <SessionTable sessions={sessions} />
    </CalendarDay>
  );
};

export default memo(SessionDay);
