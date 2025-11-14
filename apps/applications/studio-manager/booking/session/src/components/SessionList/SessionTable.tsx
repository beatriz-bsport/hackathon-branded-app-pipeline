import React, { useMemo } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useSessionListColumns } from "./columns";
import { TableRowData } from "./types";

type SessionTableProps = {
  sessions: TableRowData[];
  isLoading: boolean;
};

export const SessionTable: React.FC<SessionTableProps> = ({
  sessions,
  isLoading,
}) => {
  const { t } = useTranslation("sessionList");
  const columns = useSessionListColumns();
  const loadingProps = useMemo(
    () => ({ isLoading, message: t("table.isLoading") }),
    [isLoading, t],
  );

  return (
    <Table
      columns={columns}
      rowHeight="sm"
      // TODO(elisabeth): add empty state
      loadingProps={loadingProps}
      rows={sessions}
    ></Table>
  );
};
