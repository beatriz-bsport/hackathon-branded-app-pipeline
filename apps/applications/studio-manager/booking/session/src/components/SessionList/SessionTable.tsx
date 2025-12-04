import React, { memo } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import type { EnrichedSession } from "#src/types";
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

  return (
    <Table
      columns={columns}
      rowHeight="sm"
      loadingProps={{ isLoading, message: t("table.isLoading") }}
      rows={sessions}
    ></Table>
  );
};

export default memo(SessionTable);
