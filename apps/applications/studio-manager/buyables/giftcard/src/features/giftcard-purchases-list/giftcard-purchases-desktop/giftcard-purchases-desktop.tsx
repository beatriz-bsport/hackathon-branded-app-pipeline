import type { FC } from "react";

import type { ConsumerGiftcard } from "@bsport/api-buyables";
import { Table, type TableProps } from "@bsport/kaizen-primitive-core";

import type { PersonCell } from "../types";
import { useTableColumns } from "./columns";
import type { AvailableColumn, TableRowData } from "./constants";
import { useTableRows } from "./rows";

type GiftcardPurchasesDesktopProps = {
  giftcardPurchases: Array<ConsumerGiftcard<number, PersonCell, PersonCell>>;
  selectedColumns: Record<AvailableColumn, boolean>;
} & Pick<
  TableProps<TableRowData>,
  "paginationProps" | "emptyStateProps" | "loadingProps"
>;

export const GiftcardPurchasesDesktop: FC<GiftcardPurchasesDesktopProps> = ({
  giftcardPurchases,
  selectedColumns,
  ...tableProps
}) => {
  const columns = useTableColumns({ selectedColumns });

  const rows = useTableRows({ giftcardPurchases });

  return <Table columns={columns} rowHeight="lg" rows={rows} {...tableProps} />;
};
