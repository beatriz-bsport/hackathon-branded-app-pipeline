import {
  Avatar,
  Body,
  Button,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { TableRowData } from "./constants";

type TableColumn = GenericTableColumn<TableRowData>;

type GiftcardHandler = ({
  giftcardId,
  giftcardName,
}: {
  giftcardId: number;
  giftcardName: string;
}) => void;

export type GetTableColumnsParams = {
  handleArchive?: GiftcardHandler;
  handleDuplicate?: GiftcardHandler;
  handleRestore?: GiftcardHandler;
  mode: "archived" | "active";
};

/**
 * Return the colums configs for the Giftcard table
 */
export const useTableColumns = ({
  handleArchive,
  handleDuplicate,
  handleRestore,
  mode,
}: GetTableColumnsParams) => {
  const { t } = useTranslation("common");

  const columnAvatar: TableColumn = {
    header: t("giftcardTable.headers.name"),
    id: "column-name",
    type: "custom",
    align: "start",
    render: (row) => {
      return (
        <div className="flex flex-row gap-sm items-center">
          <Avatar
            shape="squared"
            src={row.iconSrc}
            alt={row.name}
            iconName="image-03" // Fallback value in case src is not defined
            size="md"
          />
          <Body htmlVariant="p" size="md">
            {row.name}
          </Body>
        </div>
      );
    },
  };

  const columnStatus: TableColumn = {
    header: "",
    id: "column-status",
    type: "custom",
    align: "end",
    render: (row) => (
      <div className="flex flex-row giftcards-center justify-center gap-2xs">
        {row.isShared && (
          <Tooltip
            label={t("giftcardTable.tooltips.shared")}
            placement="bottom"
          >
            <Chip
              label={t("giftcardTable.values.shared")}
              size="lg"
              type="weak"
              color="default"
            />
          </Tooltip>
        )}
        {row.isUnavailable && (
          <Tooltip
            label={t("giftcardTable.tooltips.unavailable")}
            placement="bottom"
          >
            <Chip
              label={t("giftcardTable.values.unavailable")}
              size="lg"
              type="weak"
              color="default"
            />
          </Tooltip>
        )}
      </div>
    ),
  };

  const columnPrice: TableColumn = {
    header: t("giftcardTable.headers.price"),
    id: "column-price",
    keyPath: "price",
    type: "price",
    align: "center",
  };

  const columnValidity: TableColumn = {
    header: t("giftcardTable.headers.validity"),
    id: "column-validity",
    keyPath: "validity",
    type: "string",
    align: "center",
  };

  const columnActions: TableColumn = {
    header: "",
    id: "column-actions",
    type: "custom",
    render: (row) => {
      if (row.isShared) {
        // If shared giftcard, can not perform actions
        return null;
      }

      if (mode === "archived" && handleRestore) {
        return (
          <Tooltip
            label={t("giftcardTable.tooltips.restore")}
            placement="bottom-right"
          >
            <Button
              color="default"
              intent="flat"
              size="md"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                handleRestore({
                  giftcardId: row.id,
                  giftcardName: row.name,
                });
              }}
              iconLeft="unarchive"
            />
          </Tooltip>
        );
      }

      return (
        <div className="flex flex-row gap-sm">
          {handleDuplicate && (
            <Tooltip
              label={t("giftcardTable.tooltips.duplicate")}
              placement="bottom"
            >
              <Button
                color="default"
                intent="flat"
                size="md"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleDuplicate({
                    giftcardId: row.id,
                    giftcardName: row.name,
                  });
                }}
                iconLeft="copy-03"
              />
            </Tooltip>
          )}
          {handleArchive && (
            <Tooltip
              label={t("giftcardTable.tooltips.archive")}
              placement="bottom-right"
            >
              <Button
                color="default"
                intent="flat"
                size="md"
                onClick={(event) => {
                  event.stopPropagation();
                  event.preventDefault();
                  handleArchive({
                    giftcardId: row.id,
                    giftcardName: row.name,
                  });
                }}
                iconLeft="archive"
              />
            </Tooltip>
          )}
        </div>
      );
    },
    align: "center",
  };

  return [
    columnAvatar,
    columnStatus,
    columnPrice,
    columnValidity,
    columnActions,
  ];
};
