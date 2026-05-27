import {
  Avatar,
  Body,
  Button,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { CollectionRowData } from "./types";

type TableColumn = GenericTableColumn<CollectionRowData>;

export const useCollectionTableColumns = () => {
  const { t } = useTranslation("collections-list");

  const columnNameAndDescription: TableColumn = {
    id: "collection-column-name",
    type: "custom",
    align: "start",
    colClassName: "w-full",
    header: t("table.headers.name"),
    render: (row) => {
      const hasCover = Boolean(row.thumbnailUrl?.trim());
      return (
        <div className="flex w-full min-w-0 items-center gap-xs overflow-hidden py-2xs">
          <Avatar
            shape="squared"
            size="md"
            src={hasCover ? row.thumbnailUrl : undefined}
            alt={hasCover ? row.name : ""}
            iconName={hasCover ? undefined : "image-03"}
            className="shrink-0"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2xs overflow-hidden">
            <Body
              htmlVariant="span"
              size="lg"
              color="default"
              className="block min-w-0 max-w-[320px] truncate"
            >
              {row.name}
            </Body>
            {row.description ? (
              <Body
                htmlVariant="span"
                size="md"
                color="weak"
                className="block min-w-0 max-w-[600px] truncate"
              >
                {row.description}
              </Body>
            ) : null}
          </div>
        </div>
      );
    },
  };

  const columnVideosCount: TableColumn = {
    id: "collection-column-videos-count",
    type: "custom",
    align: "center",
    colClassName: "px-md",
    header: (
      <span className="sr-only" aria-label={t("table.headers.videosCount")}>
        {t("table.headers.videosCount")}
      </span>
    ),
    render: (row) => (
      <Body htmlVariant="span" size="md" color="default">
        {t("table.videosCountLabel", { count: row.videosCount })}
      </Body>
    ),
  };

  const columnActions: TableColumn = {
    id: "collection-column-actions",
    type: "custom",
    align: "center",
    colClassName: "px-md",
    header: (
      <span className="sr-only" aria-label={t("table.headers.actions")}>
        {t("table.headers.actions")}
      </span>
    ),
    render: (row) => (
      <div className="flex items-center justify-end gap-2xs">
        {row.onEdit ? (
          <Button
            color="default"
            intent="flat"
            size="md"
            kind="icon-button"
            icon="edit-02"
            label={t("table.actions.edit")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              row.onEdit?.();
            }}
          />
        ) : null}
        {row.onDelete ? (
          <Button
            color="default"
            intent="flat"
            size="md"
            kind="icon-button"
            icon="trash-01"
            label={t("table.actions.delete")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              row.onDelete?.();
            }}
          />
        ) : null}
      </div>
    ),
  };

  return [columnNameAndDescription, columnVideosCount, columnActions];
};
