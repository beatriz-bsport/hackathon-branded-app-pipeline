import type { FC } from "react";

import { RoleType } from "@bsport/common/lib/master-data/user-role";
import {
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

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
  onDeleteRow?: (row: StaffRowData) => void;
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
  onDeleteRow,
}) => {
  const { t } = useTranslation("staff-list");
  const columns = useStaffTableColumns();
  const isMobile = !useMatchMedia("sm");
  const currentUserRole = dataAccessLayer.useUserAccess()?.role;
  const currentUserIsOwner =
    currentUserRole === RoleType.USER_ROLE_NO_RESTRICTION;

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

  const rowsWithActions = rows.map((row) => ({
    ...row,
    onDelete:
      onDeleteRow && !row.isOwner && currentUserIsOwner
        ? () => onDeleteRow(row)
        : undefined,
  }));

  if (isMobile) {
    return (
      <StaffList
        rows={rowsWithActions}
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

  const tableRows =
    onRowClick === undefined
      ? rowsWithActions
      : rowsWithActions.map((row) => ({
          ...row,
          onRowClick: () => onRowClick(row.id),
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
