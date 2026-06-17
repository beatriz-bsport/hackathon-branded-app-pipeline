import type {
  ChipProps,
  PaginationProps,
  UseEmptyStateProps,
  UseLoadingStateProps,
} from "@bsport/kaizen-primitive-core";

export type MembershipPlanInvoiceRowData = {
  id: number;
  billingDate: string;
  rawDate: string;
  isPast: boolean;
  // Date edits are blocked both when the invoice is past AND when the plan
  // bills on a fixed calendar day (legacy `disableDateModification`). Price
  // edits only depend on `isPast`.
  isDateEditDisabled: boolean;
  isFirstInvoice: boolean;
  statusChip: ChipProps;
  amount: string;
  rawAmount: number;
};

export type MembershipPlanInvoiceListProps = {
  rows: MembershipPlanInvoiceRowData[];
  isEmpty: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
  paginationProps?: PaginationProps;
  loadingProps: UseLoadingStateProps;
  onEditBillingDate: (row: MembershipPlanInvoiceRowData) => void;
  onEditPrice: (row: MembershipPlanInvoiceRowData) => void;
};
