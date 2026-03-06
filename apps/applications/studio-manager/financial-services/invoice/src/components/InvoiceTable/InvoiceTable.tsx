import type { FC } from "react";

import type {
  GenericTableColumn,
  PaginationProps,
  UseEmptyStateProps,
  UseLoadingStateProps,
} from "@bsport/kaizen-primitive-core";
import { Table, useMatchMedia } from "@bsport/kaizen-primitive-core";

import { InvoiceList } from "../InvoiceList";
import type { InvoiceTableRow } from "./types";

export type InvoiceTableProps = {
  columns: GenericTableColumn<InvoiceTableRow>[];
  rows: InvoiceTableRow[];
  paginationProps: PaginationProps;
  emptyStateProps: UseEmptyStateProps;
  loadingProps: UseLoadingStateProps;
  onDownloadPdf: (invoiceUuid: string) => void;
  onDownloadReceipt: (invoiceUuid: string) => void;
};

export const InvoiceTable: FC<InvoiceTableProps> = ({
  columns,
  rows,
  paginationProps,
  emptyStateProps,
  loadingProps,
  onDownloadPdf,
  onDownloadReceipt,
}) => {
  const isMobile = !useMatchMedia("sm");

  if (isMobile) {
    return (
      <InvoiceList
        rows={rows}
        paginationProps={paginationProps}
        emptyStateProps={emptyStateProps}
        loadingProps={loadingProps}
        onDownloadPdf={onDownloadPdf}
        onDownloadReceipt={onDownloadReceipt}
      />
    );
  }

  return (
    <Table
      columns={columns}
      rows={rows}
      paginationProps={paginationProps}
      emptyStateProps={emptyStateProps}
      loadingProps={loadingProps}
    />
  );
};
