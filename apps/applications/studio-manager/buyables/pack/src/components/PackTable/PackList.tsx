import type { FC } from "react";

import { formatPriceWithCurrency, getCurrencyDisplay } from "@bsport/currency";
import {
  type ActionButton,
  List,
  type ListProps,
  type PaginationProps,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { VisibilityBadges } from "./VisibilityBadges";
import type { TableRowData } from "./types";

const MAX_VISIBLE_PAGES = 6;

export type PackListProps = {
  tableRows: Array<TableRowData>;
  handleArchive?: ({ id, name }: { id: number; name: string }) => void;
  paginationProps: PaginationProps;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
};

export const PackList: FC<PackListProps> = ({
  tableRows,
  handleArchive,
  paginationProps,
  isEmpty,
  isEmptySearch,
  isLoading,
  emptyConfig,
}) => {
  const { t } = useTranslation("list");
  const currency = getCurrencyDisplay();

  const listItems: ListProps["items"] = tableRows.map((row) => {
    const visibilityBadges = (
      <VisibilityBadges
        hiddenForUsers={row.hiddenForUsers}
        hiddenForStaff={row.hiddenForStaff}
        limitedTime={row.limitedTime}
      />
    );

    const buttons: ActionButton[] = [];

    if (handleArchive) {
      buttons.push({
        id: `pack-${row.id}-archive`,
        kind: "icon-button",
        icon: "trash-01",
        label: t("table.tooltips.archive"),
        intent: "flat",
        color: "default",
        size: "md",
        onClick: () => handleArchive({ id: row.id, name: row.name }),
      });
    }

    const formattedPrice = formatPriceWithCurrency(row.price, currency);

    return {
      id: `pack-${row.id}`,
      title: row.name,
      description: formattedPrice,
      customNode: visibilityBadges,
      buttons,
      link: row.link,
      onClick: row.onRowClick,
    };
  });

  const mobilePagination: PaginationProps = {
    ...paginationProps,
    showRowsPerPageSelector: false,
    maxVisiblePages: MAX_VISIBLE_PAGES,
  };

  return (
    <List
      id="pack-mobile-list"
      items={listItems}
      paginationProps={mobilePagination}
      emptyStateProps={{
        isEmpty: !!isEmpty,
        emptyConfig,
        isEmptySearch: !!isEmptySearch,
        emptySearchConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
      isCompact={false}
    />
  );
};
