import React, { memo } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import type { EnrichedSession } from "#src/stores/session-list/types";
import { useTranslation } from "#src/utils/i18n";

import { useSessionListColumns } from "./columns";

type SessionTableProps = {
  sessions: EnrichedSession[];
  isLoading: boolean;
};

export const SessionTable: React.FC<SessionTableProps> = memo(
  ({ sessions, isLoading }: SessionTableProps) => {
    const { t } = useTranslation("sessionList");
    const columns = useSessionListColumns();

    return (
      <Table
        columns={columns}
        rowHeight="sm"
        // TODO(elisabeth): add empty state
        loadingProps={{ isLoading, message: t("table.isLoading") }}
        rows={sessions}
      ></Table>
    );
  },
);

SessionTable.displayName = "SessionTable";
