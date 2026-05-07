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
  isLoading: boolean;
};

export const StaffTable: FC<StaffTableProps> = ({
  rows,
  paginationProps,
  isEmpty,
  isLoading,
}) => {
  const { t } = useTranslation("staff-list");
  const columns = useStaffTableColumns();
  const isMobile = !useMatchMedia("sm");

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
  };

  if (isMobile) {
    return (
      <StaffList
        rows={rows}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isLoading={isLoading}
        emptyConfig={emptyConfig}
      />
    );
  }

  return (
    <Table
      columns={columns}
      rowHeight="lg"
      rows={rows}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty,
        emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
    />
  );
};
