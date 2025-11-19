import {
  Button,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { VisibilityBadges } from "./VisibilityBadges";
import type { TableRowData } from "./types";

type TableColumn = GenericTableColumn<TableRowData>;

export const usePackTableColumns = ({
  handleArchive,
}: {
  handleArchive?: ({ id, name }: { id: number; name: string }) => void;
}) => {
  const { t } = useTranslation("list");

  const columnName: TableColumn = {
    id: "pack-column-name",
    type: "string",
    align: "start",
    keyPath: "name",
    header: t("table.headers.name"),
  };

  const columnVisibility: TableColumn = {
    id: "pack-column-visibility",
    type: "custom",
    align: "center",
    header: t("table.headers.visibility"),
    render: (row) => {
      return (
        <VisibilityBadges
          hiddenToStaff={row.hiddenToStaff}
          limitedTime={row.limitedTime}
          unlisted={row.unlisted}
        />
      );
    },
  };

  const columnNumberOfProducts: TableColumn = {
    id: "pack-column-number-of-products",
    type: "number",
    align: "center",
    keyPath: "numberOfProducts",
    header: t("table.headers.numberOfProducts"),
  };

  const columnPrice: TableColumn = {
    id: "pack-column-price",
    type: "price",
    align: "center",
    keyPath: "price",
    header: t("table.headers.price"),
  };

  const columnActions: TableColumn = {
    id: "pack-column-actions",
    type: "custom",
    align: "center",
    header: "",
    render: (row) => {
      if (!handleArchive) return null;

      return (
        <Tooltip label={t("table.tooltips.archive")} placement="bottom-right">
          <Button
            color="default"
            intent="flat"
            size="md"
            kind="icon-button"
            icon="trash-01"
            label={t("table.tooltips.archive")}
            onClick={(event) => {
              event.stopPropagation();

              handleArchive({
                id: row.id,
                name: row.name,
              });
            }}
            onPointerDown={(event) => {
              event.stopPropagation();
            }}
            id="pack-column-actions-archive-button"
          />
        </Tooltip>
      );
    },
  };

  const columns = [
    columnName,
    columnVisibility,
    columnNumberOfProducts,
    columnPrice,
  ];

  if (handleArchive) columns.push(columnActions);

  return columns;
};
