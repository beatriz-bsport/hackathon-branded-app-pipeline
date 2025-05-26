import { clsx } from "clsx";
import React from "react";

import {
  Body,
  Loader,
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import type { Pack } from "#src/temp-api";
import { useTranslation } from "#src/utils/i18n";

import { usePackTableColumns } from "./columns";
import type { TableRowData } from "./types";

function aggregateQuantity(items: Array<{ quantity: number }>) {
  return (items ?? []).reduce(
    (currentSum, nextItem) => currentSum + nextItem.quantity,
    0,
  );
}

type PackTableProps = {
  handleArchive: ({ id, name }: { id: number; name: string }) => void;
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  onAddPackClick: () => void;
  packList: Array<Pack>;
  paginationProps: PaginationProps;
};

export const PackTable: React.FC<PackTableProps> = ({
  handleArchive,
  isEmpty = false,
  isEmptySearch = false,
  isLoading = false,
  onAddPackClick,
  packList,
  paginationProps,
}) => {
  const { t } = useTranslation("list");

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
    ctaButtonConfig: {
      label: t("actions.addAPack"),
      iconLeft: "plus" as const,
      onClick: onAddPackClick,
    },
  };
  const emptyStateProps: UseEmptyStateProps = {
    isEmpty,
    emptyConfig,
    isEmptySearch, // When fuzzy search on an empty DB
    emptySearchConfig: emptyConfig, // Same as emptyConfig, but this will show a different icon
  };

  const tableColumns = usePackTableColumns({ handleArchive });

  const tableRows: Array<TableRowData> = packList.map((pack) => {
    const {
      id,
      name,
      expiration_date,
      manager_only,
      price,
      is_usable_by_staff,
      payment_packs,
      private_passes,
      shop_items,
    } = pack;
    return {
      id,
      name,
      hiddenForStaff: !is_usable_by_staff,
      hiddenForUsers: !!manager_only,
      limitedTime: !!expiration_date,
      /** @todo Use currency package to format with the adequate currency */
      price: `$ ${price}`,
      numberOfProducts:
        aggregateQuantity(payment_packs) +
        aggregateQuantity(private_passes) +
        aggregateQuantity(shop_items),
      link: `/combo/${id}`,
    };
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <Body htmlVariant="p">{t("table.loading")}</Body>
      </div>
    );
  }

  return (
    <div
      className={clsx("w-full h-full flex flex-col flex-1", {
        "items-center justify-center": isEmpty || isEmptySearch,
      })}
    >
      <Table
        columns={tableColumns}
        rowHeight="lg"
        rows={tableRows}
        paginationProps={paginationProps}
        emptyStateProps={emptyStateProps}
      />
    </div>
  );
};
