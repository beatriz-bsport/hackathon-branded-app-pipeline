import React from "react";
import { useNavigate } from "react-router";

import {
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { Pack } from "@bsport/store-buyables-pack";

import { LEGACY_URLS, URLS } from "#src/urls";
import { USE_REVAMP_DETAILS } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import { PackList } from "./PackList";
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
  const navigate = useNavigate();

  const isMobile = !useMatchMedia("sm");

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
      price: Number.isNaN(parseFloat(price)) ? 0 : parseFloat(price),
      numberOfProducts:
        aggregateQuantity(payment_packs) +
        aggregateQuantity(private_passes) +
        aggregateQuantity(shop_items),
      link: USE_REVAMP_DETAILS ? undefined : LEGACY_URLS.PACK_DETAILS(id),
      onRowClick: USE_REVAMP_DETAILS
        ? () => navigate(URLS.DETAILS(id))
        : undefined,
    };
  });

  if (isMobile) {
    return (
      <PackList
        tableRows={tableRows}
        handleArchive={handleArchive}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        isLoading={isLoading}
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
      emptyStateProps={emptyStateProps}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
    />
  );
};
