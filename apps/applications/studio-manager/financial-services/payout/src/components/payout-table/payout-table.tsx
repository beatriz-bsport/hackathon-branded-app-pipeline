import type { FC } from "react";

import type {
  GenericTableColumn,
  PaginationProps,
  UseEmptyStateProps,
  UseLoadingStateProps,
} from "@bsport/kaizen-primitive-core";
import { Table } from "@bsport/kaizen-primitive-core";

import type { PayoutTableRow } from "./types";

export type PayoutTableProps = {
  columns: GenericTableColumn<PayoutTableRow>[];
  rows: PayoutTableRow[];
  paginationProps: PaginationProps;
  emptyStateProps: UseEmptyStateProps;
  loadingProps: UseLoadingStateProps;
};

export const PayoutTable: FC<PayoutTableProps> = ({
  columns,
  rows,
  paginationProps,
  emptyStateProps,
  loadingProps,
}) => {
  return (
    <Table
      columns={columns}
      rows={rows}
      paginationProps={paginationProps}
      emptyStateProps={emptyStateProps}
      loadingProps={loadingProps}
      rowHeight="lg"
    />
  );
};
