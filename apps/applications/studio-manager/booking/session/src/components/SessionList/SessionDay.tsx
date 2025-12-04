import React, { memo } from "react";

import { fromIsoString } from "@bsport/datetime-manipulation";

import type { EnrichedSession } from "#src/types";

import SessionDayTitle from "./SessionDayTitle";
import SessionTable from "./SessionTable";

type SessionDayProps = {
  date: string;
  sessions: EnrichedSession[];
  isLoading: boolean;
  locale: string;
};

const SessionDay: React.FC<SessionDayProps> = ({
  date,
  sessions,
  isLoading,
  locale,
}: SessionDayProps) => {
  const localizedDate = fromIsoString(date, {
    locale: locale,
  });
  return (
    // Scroll margin top is needed when scrolling using the Today button.
    <div data-date={date} className="scroll-mt-2xl">
      <SessionDayTitle date={localizedDate} sessions={sessions} />
      <SessionTable sessions={sessions} isLoading={isLoading} />
    </div>
  );
};

export default memo(SessionDay);
