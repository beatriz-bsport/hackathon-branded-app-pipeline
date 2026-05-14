import type { FC } from "react";

import {
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useStaffTableColumns } from "./columns";
import { StaffList } from "./staff-list";
import type { StaffRowData } from "./types";

type StaffTableProps = {
  rows: StaffRowData[];
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isEmptySearch?: boolean;
  isLoading: boolean;
  onClearFilters?: () => void;
  onCreate?: () => void;
  onRowClick?: (id: number) => void;
};

export const StaffTable: FC<StaffTableProps> = ({
  rows,
  paginationProps,
  isEmpty,
  isEmptySearch = false,
  isLoading,
  onClearFilters,
  onCreate,
  onRowClick,
}) => {
  const { t } = useTranslation("staff-list");
  const columns = useStaffTableColumns();
  const isMobile = !useMatchMedia("sm");

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
    ctaButtonConfig: onCreate
      ? {
          label: t("table.emptyList.cta"),
          iconLeft: "plus" as const,
          onClick: onCreate,
        }
      : undefined,
  };

  const emptySearchConfig: UseEmptyStateProps["emptySearchConfig"] = {
    title: t("table.emptySearch.title"),
    subtitle: t("table.emptySearch.subtitle"),
    ctaButtonConfig: onClearFilters
      ? {
          label: t("table.emptySearch.cta"),
          onClick: onClearFilters,
          iconLeft: "x",
        }
      : undefined,
  };

  if (isMobile) {
    return (
      <StaffList
        rows={rows}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        isLoading={isLoading}
        emptyConfig={emptyConfig}
        emptySearchConfig={emptySearchConfig}
        onRowClick={onRowClick}
      />
    );
  }

  const tableRows = rows.map((row) => ({
    ...row,
    onRowClick: () => onRowClick?.(row.id),
  }));

  return (
    <Table
      columns={columns}
      rowHeight="lg"
      rows={tableRows}
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
    />
  );
};
