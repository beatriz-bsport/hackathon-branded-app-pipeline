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
    onItemClick: onRowClick ? () => onRowClick(row.id) : undefined,
    buttons: row.onDelete
      ? [
          {
            id: `staff-${row.id}-delete`,
            kind: "icon-button" as const,
            icon: "trash-01" as const,
            color: "default" as const,
            intent: "flat" as const,
            size: "md" as const,
            label: t("table.actions.delete"),
            onClick: row.onDelete,
          },
        ]
      : [],
    dropdownConfig: { visibleActionsDisplayLimit: 0 },
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
