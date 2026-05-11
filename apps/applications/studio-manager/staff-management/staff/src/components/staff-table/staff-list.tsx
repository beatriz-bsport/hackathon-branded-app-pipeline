import type { FC } from "react";

import {
  List,
  type ListProps,
  type PaginationProps,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { StaffRowData } from "./types";

type StaffListProps = {
  rows: StaffRowData[];
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isEmptySearch?: boolean;
  isLoading: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
  emptySearchConfig?: UseEmptyStateProps["emptySearchConfig"];
  onRowClick?: (id: number) => void;
};

export const StaffList: FC<StaffListProps> = ({
  rows,
  paginationProps,
  isEmpty,
  isEmptySearch = false,
  isLoading,
  emptyConfig,
  emptySearchConfig,
  onRowClick,
}) => {
  const { t } = useTranslation("staff-list");

  const items: ListProps["items"] = rows.map((row) => ({
    id: `staff-${row.id}`,
    title: row.name,
    description: row.roleName ?? undefined,
    onItemClick: () => onRowClick?.(row.id),
  }));

  return (
    <List
      id="staff-mobile-list"
      items={items}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty,
        emptyConfig,
        isEmptySearch,
        emptySearchConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
      isCompact={false}
    />
  );
};
