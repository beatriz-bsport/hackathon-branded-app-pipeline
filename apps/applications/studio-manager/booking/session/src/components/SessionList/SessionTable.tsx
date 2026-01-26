import React, { memo, useMemo } from "react";

import { Table, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { selectDisplayedColumns } from "#src/stores/session-list/selectors";
import { useSessionListStore } from "#src/stores/session-list/store";
import type { Columns, EnrichedSession } from "#src/types";
import { useTranslation } from "#src/utils/i18n";

import { SessionCards } from "./SessionCards";
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
  const isMobile = !useMatchMedia("lg");

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) =>
        displayedColumns.includes(column.id as Columns),
      ),
    [columns, displayedColumns],
  );

  if (isMobile) {
    return (
      <SessionCards
        columns={filteredColumns}
        isLoading={isLoading}
        rows={sessions}
      />
    );
  }

  return (
    <Table
      columns={filteredColumns}
      rowHeight="sm"
      loadingProps={{ isLoading, message: t("table.isLoading") }}
      rows={sessions}
    />
  );
};

export default memo(SessionTable);
