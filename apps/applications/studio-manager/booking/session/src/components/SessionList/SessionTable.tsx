import React, { memo, useMemo } from "react";

import { Table, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { selectDisplayedColumns } from "#src/stores/session-list/selectors";
import { useSessionListStore } from "#src/stores/session-list/store";
import type { Columns, EnrichedSession } from "#src/types";

import { useSessionListColumns } from "./columns";
import { SessionCards } from "./session-cards";

type SessionTableProps = {
  sessions: EnrichedSession[];
};

const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
}: SessionTableProps) => {
  const displayedColumns = useSessionListStore(selectDisplayedColumns);
  const isMobile = !useMatchMedia("lg");
  const columns = useSessionListColumns(isMobile);

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        displayedColumns.includes(column.id as Columns),
      ),
    [columns, displayedColumns],
  );

  if (isMobile) {
    return <SessionCards columns={filteredColumns} rows={sessions} />;
  }

  return <Table columns={filteredColumns} rowHeight="sm" rows={sessions} />;
};

export default memo(SessionTable);
