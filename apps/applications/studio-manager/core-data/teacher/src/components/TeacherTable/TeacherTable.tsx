import React from "react";

import { type PaginationProps, Table } from "@bsport/kaizen-primitive-core";
import type { Teacher } from "@bsport/store-core-data-teacher";

import { LEGACY_URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { useTeacherTableColumns } from "./columns";
import type {
  TableColumnsParams,
  TableRequiredPermissions,
  TableRowData,
} from "./types";

type TeacherTableProps = {
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  onAddTeacherClick?: () => void;
  paginationProps: PaginationProps;
  teachers: Array<Teacher>;
  permissions: TableRequiredPermissions;
} & TableColumnsParams;

export const TeacherTable: React.FC<TeacherTableProps> = ({
  handleArchive,
  handleRestore,
  isEmpty,
  isEmptySearch,
  isLoading,
  mode,
  onAddTeacherClick,
  paginationProps,
  permissions,
  teachers,
}) => {
  const { t } = useTranslation("common");

  const tableColumns = useTeacherTableColumns({
    handleArchive,
    handleRestore,
    mode,
    permissions,
  });

  const tableRows: Array<TableRowData> = teachers.map((value) => {
    return {
      name: value.name,
      email: value.email ?? "",
      initials:
        `${value.firstname?.[0] ?? ""}${value.lastname?.[0] ?? ""}`.toUpperCase(),
      iconSrc: value.photo ?? "",
      id: value.id,
      phone: value.phone ?? "",
      link: permissions.edit ? LEGACY_URLS.DETAILS(value.id) : undefined,
    };
  });

  const emptyConfig =
    mode === "archived"
      ? {
          title: t("table.empty.archivedList.title"),
          subtitle: t("table.empty.archivedList.subtitle"),
        }
      : {
          title: t("table.empty.activeList.title"),
          subtitle: t("table.empty.activeList.subtitle"),
          ctaButtonConfig: permissions.create
            ? {
                label: t("activeList.actions.addTeacher"),
                iconLeft: "plus" as const,
                onClick: onAddTeacherClick,
              }
            : undefined,
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
        isEmptySearch: !!isEmptySearch,
        emptySearchConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t(
          mode === "archived"
            ? "table.loading.archivedList"
            : "table.loading.activeList",
        ),
      }}
    />
  );
};
