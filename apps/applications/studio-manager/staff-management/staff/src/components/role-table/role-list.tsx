import type { FC } from "react";

import {
  Chip,
  List,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { RoleRowData } from "./types";

type RoleListProps = {
  rows: RoleRowData[];
  isEmpty: boolean;
  isLoading: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
};

type RoleListItemData = {
  id: string;
  name: string;
  isDefault: boolean;
};

const RoleListItem: FC<RoleListItemData> = ({ name, isDefault }) => (
  <li className="relative flex min-h-2xl items-center gap-xs border-b-stroke-thin border-b-stroke-divider px-md py-xs">
    <Chip
      label={name}
      type="weak"
      color="default"
      size="lg"
      iconLeft={isDefault ? "lock-01" : undefined}
    />
  </li>
);

export const RoleList: FC<RoleListProps> = ({
  rows,
  isEmpty,
  isLoading,
  emptyConfig,
}) => {
  const { t } = useTranslation("role-list");

  const items: RoleListItemData[] = rows.map((row) => ({
    id: `role-${row.id}`,
    name: row.name,
    isDefault: row.isDefault,
  }));

  return (
    <List
      id="role-mobile-list"
      items={items}
      ListItem={RoleListItem}
      emptyStateProps={{
        isEmpty,
        emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
      isCompact={false}
    />
  );
};
