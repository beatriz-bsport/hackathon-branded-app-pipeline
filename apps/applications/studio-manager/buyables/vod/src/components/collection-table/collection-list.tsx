import type { FC } from "react";

import {
  List,
  type ListProps,
  type PaginationProps,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { CollectionRowData } from "./types";

type CollectionListProps = {
  rows: CollectionRowData[];
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isLoading: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
};

export const CollectionList: FC<CollectionListProps> = ({
  rows,
  paginationProps,
  isEmpty,
  isLoading,
  emptyConfig,
}) => {
  const { t } = useTranslation("collections-list");

  const items: ListProps["items"] = rows.map((row) => {
    const hasCover = Boolean(row.thumbnailUrl?.trim());
    return {
      id: `collection-${row.id}`,
      title: row.name,
      description: row.description,
      onItemClick: row.onRowClick,
      avatar: {
        shape: "squared" as const,
        size: "md" as const,
        src: hasCover ? row.thumbnailUrl : undefined,
        alt: hasCover ? row.name : "",
        iconName: hasCover ? undefined : "image-03",
        className: "cursor-default border-stroke-thin",
      },
      buttons: [
        ...(row.onEdit
          ? [
              {
                id: `collection-${row.id}-edit`,
                kind: "icon-button" as const,
                icon: "edit-02" as const,
                color: "default" as const,
                intent: "flat" as const,
                size: "md" as const,
                label: t("table.actions.edit"),
                onClick: row.onEdit,
              },
            ]
          : []),
        ...(row.onDelete
          ? [
              {
                id: `collection-${row.id}-delete`,
                kind: "icon-button" as const,
                icon: "trash-01" as const,
                color: "default" as const,
                intent: "flat" as const,
                size: "md" as const,
                label: t("table.actions.delete"),
                onClick: row.onDelete,
              },
            ]
          : []),
      ],
    };
  });

  return (
    <List
      id="collection-mobile-list"
      items={items}
      paginationProps={paginationProps}
      emptyStateProps={{
        isEmpty,
        emptyConfig,
        isEmptySearch: false,
        emptySearchConfig: emptyConfig,
      }}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
      isCompact={false}
    />
  );
};
