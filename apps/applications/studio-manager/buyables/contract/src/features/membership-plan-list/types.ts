import type {
  ChipProps,
  PaginationProps,
  UseEmptyStateProps,
  WithTooltip,
} from "@bsport/kaizen-primitive-core";

export type MembershipPlanRowData = {
  id: number;
  memberName: string;
  memberInitials: string;
  startDate: string;
  statusChip: WithTooltip<ChipProps>;
  onViewBillingPlan: () => void;
};

export type MembershipPlanListProps = {
  rows: MembershipPlanRowData[];
  isEmpty: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
  paginationProps?: PaginationProps;
  loadingProps: {
    isLoading?: boolean;
    message?: string;
  };
};
