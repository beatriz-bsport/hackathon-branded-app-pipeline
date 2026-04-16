import type { FC } from "react";

import type { Collection } from "@bsport/api-buyables/collection";
import {
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { CollectionList } from "./collection-list";
import { useCollectionTableColumns } from "./columns";
import type { CollectionRowData } from "./types";

type CollectionTableProps = {
  collections: Collection[];
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isLoading: boolean;
  onCreate?: () => void;
  onRowClick?: (id: number) => void;
  onEdit?: (collection: Collection) => void;
};

export const CollectionTable: FC<CollectionTableProps> = ({
  collections,
  paginationProps,
  isEmpty,
  isLoading,
  onCreate,
  onRowClick,
  onEdit,
}) => {
  const { t } = useTranslation("collections-list");

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
    ctaButtonConfig: onCreate
      ? {
          label: t("table.headers.createCollection"),
          iconLeft: "plus" as const,
          onClick: onCreate,
        }
      : undefined,
  };

  const emptyStateProps: UseEmptyStateProps = {
    isEmpty,
    emptyConfig,
  };

  const columns = useCollectionTableColumns();
  const isMobile = !useMatchMedia("sm");

  const rows: CollectionRowData[] = collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    description: collection.description,
    thumbnailUrl: collection.cover_main,
    videosCount: collection.videos.length,
    onRowClick: onRowClick ? () => onRowClick(collection.id) : undefined,
    onEdit: onEdit ? () => onEdit(collection) : undefined,
  }));

  if (isMobile) {
    return (
      <CollectionList
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
      emptyStateProps={emptyStateProps}
      loadingProps={{
        isLoading,
        message: t("table.loading"),
      }}
    />
  );
};
