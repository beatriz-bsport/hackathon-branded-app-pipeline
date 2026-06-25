import {
  type GenericTableColumn,
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { SmartlistMembersTableRow } from "./types";

type SmartlistMembersTableProps = {
  columns: GenericTableColumn<SmartlistMembersTableRow>[];
  rows: SmartlistMembersTableRow[];
  paginationProps: PaginationProps;
  emptyStateProps: UseEmptyStateProps;
  isLoading?: boolean;
};

/**
 * Presentational table for smartlist members.
 */
export const SmartlistMembersTable = ({
  columns,
  rows,
  paginationProps,
  emptyStateProps,
  isLoading = false,
}: SmartlistMembersTableProps) => {
  const { t } = useTranslation("details");

  return (
    <Table
      columns={columns}
      rows={rows}
      rowHeight="lg"
      loadingProps={{
        isLoading,
        message: t("membersTable.loading"),
      }}
      emptyStateProps={emptyStateProps}
      paginationProps={{
        ...paginationProps,
        showRowsPerPageSelector: true,
      }}
    />
  );
};
