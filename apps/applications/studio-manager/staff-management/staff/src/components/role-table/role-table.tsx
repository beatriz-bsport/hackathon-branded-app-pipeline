import { type FC } from "react";

import {
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useRoleTableColumns } from "./columns";
import { RoleList } from "./role-list";
import type { RoleRowData } from "./types";

type RoleTableProps = {
  rows: RoleRowData[];
  isEmpty: boolean;
  isLoading: boolean;
  onCreateRole: () => void;
};

export const RoleTable: FC<RoleTableProps> = ({
  rows,
  isEmpty,
  isLoading,
  onCreateRole,
}) => {
  const { t } = useTranslation("role-list");
  const columns = useRoleTableColumns();
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

  if (isMobile) {
    return (
      <RoleList
        rows={rows}
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
