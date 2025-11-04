import { Decimal } from "decimal.js";
import React from "react";

import { Table, type TableProps } from "@bsport/kaizen-primitive-core";
import { GIFTCARD_TYPES, type Giftcard } from "@bsport/store-buyables-giftcard";

import { LEGACY_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { type GetTableColumnsParams, useTableColumns } from "./columns";
import type { TableRowData } from "./constants";

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
    isUnavailable: giftcard.manager_only,
    name: giftcard.name,
    price:
      giftcard.card_type === GIFTCARD_TYPES.CUSTOM || !giftcard.price
        ? t("giftcardTable.values.customAmount")
        : new Decimal(giftcard.price).toNumber(),
    validity: giftcard.expiration_days
      ? t("giftcardTable.values.expireInXDays", {
          expiration: giftcard.expiration_days,
        })
      : "Unlimited",
    link: mode === "active" ? LEGACY_ROUTES.DETAILS(giftcard.id) : undefined, // Navigation blocked for archived items
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
      rowHeight="lg"
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
