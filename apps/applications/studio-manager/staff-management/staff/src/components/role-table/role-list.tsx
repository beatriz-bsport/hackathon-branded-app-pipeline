import type { FC, KeyboardEvent } from "react";

import {
  Chip,
  List,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { RoleRowActions } from "./role-row-actions";
import type { RoleRowData } from "./types";

type RoleListProps = {
  rows: RoleRowData[];
  isEmpty: boolean;
  isEmptySearch?: boolean;
  isLoading: boolean;
  emptyConfig: NonNullable<UseEmptyStateProps["emptyConfig"]>;
  emptySearchConfig?: UseEmptyStateProps["emptySearchConfig"];
  onDelete: (role: RoleRowData) => void;
};

type RoleListItemData = {
  id: string;
  row: RoleRowData;
  name: string;
  isDefault: boolean;
  onItemClick?: () => void;
  onDelete: (role: RoleRowData) => void;
};

const RoleListItem: FC<RoleListItemData> = ({
  row,
  name,
  isDefault,
  onItemClick,
  onDelete,
}) => {
  const handleKeyDown = (event: KeyboardEvent<HTMLLIElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onItemClick?.();
    }
  };

  return (
    <li
      className="relative flex min-h-2xl cursor-pointer items-center gap-xs border-b-stroke-thin border-b-stroke-divider px-md py-xs"
      onClick={onItemClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <Chip
        label={name}
        type="weak"
        color="default"
        size="lg"
        iconLeft={isDefault ? "lock-01" : undefined}
      />
      <RoleRowActions row={row} onDelete={onDelete} />
    </li>
  );
};

export const RoleList: FC<RoleListProps> = ({
  rows,
  isEmpty,
  isEmptySearch = false,
  isLoading,
  emptyConfig,
  emptySearchConfig,
  onDelete,
}) => {
  const { t } = useTranslation("role-list");

  const items: RoleListItemData[] = rows.map((row) => ({
    id: `role-${row.id}`,
    row,
    name: row.name,
    isDefault: row.isDefault,
    onItemClick: row.onRowClick,
    onDelete,
  }));

  return (
    <List
      id="role-mobile-list"
      items={items}
      ListItem={RoleListItem}
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
