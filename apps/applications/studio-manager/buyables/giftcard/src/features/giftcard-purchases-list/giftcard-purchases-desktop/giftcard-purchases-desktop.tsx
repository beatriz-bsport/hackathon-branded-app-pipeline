import type { FC } from "react";

import { Table, type TableProps } from "@bsport/kaizen-primitive-core";

import type { GiftcardPurchase } from "../types";
import { useTableColumns } from "./columns";
import type { AvailableColumn, TableRowData } from "./constants";
import { useTableRows } from "./rows";

type GiftcardPurchasesDesktopProps = {
  giftcardPurchases: GiftcardPurchase[];
  selectedColumns: Record<AvailableColumn, boolean>;
  onItemClick: (value: GiftcardPurchase) => void;
  selectedItem: GiftcardPurchase | null;
} & Pick<
  TableProps<TableRowData>,
  "paginationProps" | "emptyStateProps" | "loadingProps"
>;

export const GiftcardPurchasesDesktop: FC<GiftcardPurchasesDesktopProps> = ({
  giftcardPurchases,
  selectedColumns,
  onItemClick,
  selectedItem,
  ...tableProps
}) => {
  const columns = useTableColumns({ selectedColumns });

  const rows = useTableRows({ giftcardPurchases, onItemClick, selectedItem });

  return <Table columns={columns} rowHeight="lg" rows={rows} {...tableProps} />;
};
