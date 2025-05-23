import React from "react";

import { Table, type TableProps } from "@bsport/kaizen-primitive-core";
import type { Giftcard } from "@bsport/store-buyables-giftcard";

import { useTranslation } from "#src/utils/i18n";

import type { TableRowData } from "./constants";
import {
  type GetTableColumnsParams,
  useTableColumns,
} from "./giftcard-columns";

type GiftcardTableProps = Omit<GetTableColumnsParams, "t"> & {
  giftcardList: Array<Giftcard>;
  paginationProps: TableProps<TableRowData>["paginationProps"];
  isLoading?: boolean;
  isEmpty?: boolean;
  onAddGiftcardClick?: () => void;
};

export const GiftcardTable: React.FC<GiftcardTableProps> = ({
  giftcardList,
  handleArchive,
  handleDuplicate,
  handleRestore,
  mode,
  paginationProps,
  isLoading,
  isEmpty,
  onAddGiftcardClick,
}) => {
  const { t } = useTranslation("common");

  const tableColumns = useTableColumns({
    handleArchive,
    handleDuplicate,
    handleRestore,
    mode,
  });

  // Format giftcards to match GiftcardTable data
  const tableRows = giftcardList.map((giftcard) => ({
    id: giftcard.id,
    iconSrc: giftcard.cover,
    isShared: giftcard.is_shared_giftcard,
    isUnavailable: giftcard.manager_only, // TODO : What field corresponds to unavailable ?
    name: giftcard.name,
    price: `$${giftcard.price}`, // TODO : use util to get right currency display
    validity: giftcard.expiration_days
      ? t("giftcardTable.values.expireInXDays", {
          expiration: giftcard.expiration_days,
        })
      : "Unlimited",
  }));

  // Configure empty state based on the mode
  const emptyConfig =
    mode === "archived"
      ? {
          title: t("archivedListPage.empty.title"),
        }
      : {
          title: t("listPage.empty.title"),
          subtitle: t("listPage.empty.subtitle"),
          ctaButtonConfig: {
            label: t("listPage.header.buttons.addGiftcard"),
            iconLeft: "plus" as const,
            onClick: onAddGiftcardClick,
          },
        };

  return (
    <Table
      columns={tableColumns}
      rowHeight="sm"
      rows={tableRows}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: !!isEmpty,
        emptyConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("giftcardTable.loading"),
      }}
    />
  );
};
