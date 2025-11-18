import type { FC } from "react";

import { getCurrencyDisplayWithPrice } from "@bsport/currency";
import {
  Table,
  type TableProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { GIFTCARD_TYPES, type Giftcard } from "@bsport/store-buyables-giftcard";

import { LEGACY_ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { GiftcardList } from "./GiftcardList";
import { type GetTableColumnsParams, useTableColumns } from "./columns";
import type { TableRowData } from "./constants";

type GiftcardTableProps = Omit<GetTableColumnsParams, "t"> & {
  giftcardList: Array<Giftcard>;
  paginationProps: TableProps<TableRowData>["paginationProps"];
  isLoading?: boolean;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  onAddGiftcardClick?: () => void;
};

export const GiftcardTable: FC<GiftcardTableProps> = ({
  giftcardList,
  handleArchive,
  handleDuplicate,
  handleRestore,
  mode,
  paginationProps,
  isLoading,
  isEmpty,
  isEmptySearch,
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
        : getCurrencyDisplayWithPrice(+giftcard.price),
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

  const isMobile = !useMatchMedia("lg");

  if (isMobile) {
    return (
      <GiftcardList
        mode={mode}
        giftcardList={giftcardList}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        isLoading={isLoading}
        handleArchive={handleArchive}
        handleDuplicate={handleDuplicate}
        handleRestore={handleRestore}
        emptyConfig={emptyConfig}
      />
    );
  }

  return (
    <Table
      columns={tableColumns}
      rowHeight="lg"
      rows={tableRows}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty: !!isEmpty,
        emptyConfig: emptyConfig,
        isEmptySearch: !!isEmptySearch,
        emptySearchConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("giftcardTable.loading"),
      }}
    />
  );
};
