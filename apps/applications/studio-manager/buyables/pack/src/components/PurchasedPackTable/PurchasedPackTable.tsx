import type { FC } from "react";

import {
  List,
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import type { PurchasedPack } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import { usePurchasedPackTableColumns } from "./columns";
import { usePurchasedPackRows } from "./rows";

type ConsumerPackTableProps = {
  isEmpty: boolean;
  isLoading: boolean;
  paginationParams: PaginationProps;
  purchasedPacks: PurchasedPack[];
};

export const PurchasedPackTable: FC<ConsumerPackTableProps> = ({
  isEmpty,
  isLoading,
  paginationParams,
  purchasedPacks,
}) => {
  const { t } = useTranslation("details");

  const { rows, getMobileRows } = usePurchasedPackRows(purchasedPacks);

  const columns = usePurchasedPackTableColumns();

  const emptyStateConfig: UseEmptyStateProps = {
    isEmpty,
    emptyConfig: {
      title: t("overviewPage.emptyList.title"),
      subtitle: t("overviewPage.emptyList.subtitle"),
    },
  };

  const loadingConfig = {
    isLoading,
    message: t("overviewPage.loading"),
  };

  const isMobile = !useMatchMedia("sm");

  if (isMobile) {
    const items = getMobileRows();
    return (
      <List
        id="purchased-pack-mobile-list"
        paginationProps={paginationParams}
        emptyStateProps={emptyStateConfig}
        loadingProps={loadingConfig}
        items={items}
        isCompact
      />
    );
  }

  return (
    <Table
      rows={rows}
      columns={columns}
      paginationProps={paginationParams}
      emptyStateProps={emptyStateConfig}
      loadingProps={loadingConfig}
    />
  );
};
