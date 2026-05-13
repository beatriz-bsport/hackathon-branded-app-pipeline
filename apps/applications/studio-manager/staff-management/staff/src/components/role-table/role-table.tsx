import { type FC, useState } from "react";

import {
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { RoleDeleteModal } from "#src/features/role-delete/role-delete-modal";
import { useTranslation } from "#src/utils/i18n";

import { useRoleTableColumns } from "./columns";
import { RoleList } from "./role-list";
import type { RoleRowData } from "./types";

type RoleTableProps = {
  rows: RoleRowData[];
  isEmpty: boolean;
  isEmptySearch?: boolean;
  onClearFilters?: () => void;
  isLoading: boolean;
  onCreateRole: () => void;
};

export const RoleTable: FC<RoleTableProps> = ({
  rows,
  isEmpty,
  isEmptySearch = false,
  onClearFilters,
  isLoading,
  onCreateRole,
}) => {
  const { t } = useTranslation("role-list");
  const [roleToDelete, setRoleToDelete] = useState<RoleRowData | null>(null);
  const columns = useRoleTableColumns(setRoleToDelete);
  const isMobile = !useMatchMedia("sm");

  const emptyConfig: NonNullable<UseEmptyStateProps["emptyConfig"]> = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
    ctaButtonConfig: {
      label: t("table.emptyList.cta"),
      iconLeft: "plus" as const,
      onClick: onCreateRole,
    },
  };

  const emptySearchConfig: UseEmptyStateProps["emptySearchConfig"] = {
    title: t("filters.emptySearch.title"),
    subtitle: t("filters.emptySearch.subtitle"),
    ctaButtonConfig: onClearFilters
      ? {
          label: t("filters.emptySearch.cta"),
          onClick: onClearFilters,
          iconLeft: "x",
        }
      : undefined,
  };

  return (
    <>
      {isMobile ? (
        <RoleList
          rows={rows}
          isEmpty={isEmpty}
          isEmptySearch={isEmptySearch}
          isLoading={isLoading}
          emptyConfig={emptyConfig}
          emptySearchConfig={emptySearchConfig}
          onDelete={setRoleToDelete}
        />
      ) : (
        <Table
          columns={columns}
          rowHeight="lg"
          rows={rows}
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
      )}
      <RoleDeleteModal
        role={roleToDelete}
        onClose={() => setRoleToDelete(null)}
      />
    </>
  );
};
