import {
  Avatar,
  Body,
  Chip,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { type TableRowData } from "./constants";
import { getOrderStatusChipConfig } from "./transformers";

type TableColumn = GenericTableColumn<TableRowData>;

export const useOrderTableColumns = () => {
  const { t } = useTranslation(["list", "common"]);

  const columnDateUpdated: TableColumn = {
    header: t("table.headers.lastDateUpdated", { ns: "list" }),
    id: "column-date-updated",
    type: "datetime",
    align: "start",
    keyPath: "dateUpdated",
  };

  const columnBuyer: TableColumn = {
    header: t("table.headers.buyer", { ns: "list" }),
    id: "column-buyer",
    type: "custom",
    align: "start",
    render: (row) => (
      <div className="flex flex-row gap-sm items-center">
        <Avatar
          shape="round"
          initials={row.memberInitials}
          src={row.memberPhotoSrc}
          alt={row.memberName}
        />
        <Body htmlVariant="p" className="truncate max-w-[180px]">
          {row.memberName}
        </Body>
      </div>
    ),
  };

  const columnStatus: TableColumn = {
    header: t("table.headers.orderStatus", { ns: "list" }),
    id: "column-status",
    type: "custom",
    align: "center",
    render: (row) => {
      const { color, label } = getOrderStatusChipConfig(row.orderStatus, t);
      return <Chip color={color} size="lg" type="weak" label={label} />;
    },
  };

  const columnQuantity: TableColumn = {
    header: t("table.headers.quantity", { ns: "list" }),
    id: "column-quantity",
    type: "number",
    align: "center",
    keyPath: "orderQuantity",
  };

  const columnTotal: TableColumn = {
    header: t("table.headers.total", { ns: "list" }),
    id: "column-total",
    type: "price",
    align: "end",
    keyPath: "orderTotal",
  };

  const columnDateCreated: TableColumn = {
    header: t("table.headers.dateCreated", { ns: "list" }),
    id: "column-date-created",
    type: "datetime",
    align: "center",
    keyPath: "dateCreated",
  };

  return [
    columnDateUpdated,
    columnBuyer,
    columnStatus,
    columnQuantity,
    columnTotal,
    columnDateCreated,
  ];
};
