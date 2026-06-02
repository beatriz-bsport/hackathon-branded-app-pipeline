import type { FC } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { useMembershipPlanColumns } from "./columns";
import type { MembershipPlanListProps } from "./types";

export const MembershipPlanTable: FC<MembershipPlanListProps> = ({
  rows,
  isEmpty,
  emptyConfig,
  paginationProps,
  loadingProps,
}) => {
  const columns = useMembershipPlanColumns();

  return (
    <Table
      columns={columns}
      rowHeight="lg"
      rows={rows}
      paginationProps={paginationProps}
      emptyStateProps={{ isEmpty, emptyConfig }}
      loadingProps={loadingProps}
    />
  );
};
