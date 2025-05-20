import { clsx } from "clsx";
import React from "react";

import {
  Body,
  Loader,
  type PaginationProps,
  Table,
} from "@bsport/kaizen-primitive-core";
import type { Teacher } from "@bsport/store-core-data-teacher";

import { useTranslation } from "#src/utils/i18n";

import {
  type TableColumnsParams,
  type TableRowData,
  useTeacherTableColumns,
} from "./columns";

type TeacherTableProps = {
  isEmpty?: boolean;
  isEmptySearch?: boolean;
  isLoading?: boolean;
  onAddTeacherClick?: () => void;
  paginationProps: PaginationProps;
  teachers: Array<Teacher>;
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
  teachers,
}) => {
  const { t } = useTranslation("common");

  const tableColumns = useTeacherTableColumns({
    handleArchive,
    handleRestore,
    mode,
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
          ctaButtonConfig: {
            label: t("activeList.actions.addTeacher"),
            iconLeft: "plus" as const,
            onClick: onAddTeacherClick,
          },
        };

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-md">
        <Loader size="xl" />
        <Body htmlVariant="p">
          {t(
            mode === "archived"
              ? "table.loading.archivedList"
              : "table.loading.activeList",
          )}
        </Body>
      </div>
    );
  }

  return (
    <div
      className={clsx("w-full flex flex-col", {
        "h-full justify-center": !!isEmpty,
      })}
    >
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
      />
    </div>
  );
};
