import React, { memo, useMemo } from "react";

import { Table, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { selectSessionDisplayedColumns } from "#src/stores/calendar/selectors";
import { useCalendarStore } from "#src/stores/calendar/store";
import type { EnrichedSession, SessionColumns } from "#src/types";

import { useSessionListColumns } from "./columns";
import { SessionCards } from "./session-cards";

type SessionTableProps = {
  sessions: EnrichedSession[];
};

const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
}: SessionTableProps) => {
  const displayedColumns = useCalendarStore(selectSessionDisplayedColumns);
  const isMobile = !useMatchMedia("lg");
  const columns = useSessionListColumns(isMobile);

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        displayedColumns.includes(column.id as SessionColumns),
      ),
    [columns, displayedColumns],
  );

  if (isMobile) {
    return <SessionCards columns={filteredColumns} rows={sessions} />;
  }

  return (
    <div className="overflow-x-auto">
      <Table
        className="cursor-pointer"
        columns={filteredColumns}
        rowHeight="lg"
        rows={sessions}
      />
    </div>
  );
};

export default memo(SessionTable);
