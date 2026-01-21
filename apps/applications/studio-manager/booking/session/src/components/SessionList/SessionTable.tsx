import React, { memo, useMemo } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { selectDisplayedColumns } from "#src/stores/session-list/selectors";
import { useSessionListStore } from "#src/stores/session-list/store";
import type { Columns, EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { useSessionListColumns } from "./columns";

type SessionTableProps = {
  sessions: EnrichedSession[];
  isLoading: boolean;
};

const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  isLoading,
}: SessionTableProps) => {
  const { t } = useTranslation("sessionList");
  const columns = useSessionListColumns();
  const displayedColumns = useSessionListStore(selectDisplayedColumns);

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        displayedColumns.includes(column.id as Columns),
      ),
    [columns, displayedColumns],
  );

  return (
    <Table
      columns={filteredColumns}
      rowHeight="sm"
      loadingProps={{ isLoading, message: t("table.isLoading") }}
      rows={sessions}
    ></Table>
  );
};

export default memo(SessionTable);
