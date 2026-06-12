import type { FC } from "react";

import { Table } from "@bsport/kaizen-primitive-core";

import { useMembershipPlanInvoiceColumns } from "./columns";
import type { MembershipPlanInvoiceListProps } from "./types";

export const MembershipPlanInvoiceTable: FC<MembershipPlanInvoiceListProps> = ({
  rows,
  isEmpty,
  emptyConfig,
  paginationProps,
  loadingProps,
}) => {
  const columns = useMembershipPlanInvoiceColumns();

  return (
    <Table
      columns={columns}
      rows={rows}
      paginationProps={paginationProps}
      emptyStateProps={{ isEmpty, emptyConfig }}
      loadingProps={loadingProps}
    />
  );
};
