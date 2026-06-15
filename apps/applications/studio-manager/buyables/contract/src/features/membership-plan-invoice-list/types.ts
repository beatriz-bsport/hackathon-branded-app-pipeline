import type {
  ChipProps,
  PaginationProps,
  UseEmptyStateProps,
  UseLoadingStateProps,
} from "@bsport/kaizen-primitive-core";

export type MembershipPlanInvoiceRowData = {
  id: number;
  billingDate: string;
  statusChip: ChipProps;
  amount: string;
};

export type MembershipPlanInvoiceListProps = {
  rows: MembershipPlanInvoiceRowData[];
  isEmpty: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
  paginationProps?: PaginationProps;
  loadingProps: UseLoadingStateProps;
};
