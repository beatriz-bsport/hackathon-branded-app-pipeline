import {
  Avatar,
  Body,
  Button,
  type GenericTableColumn,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { CollectionRowData } from "./types";

type TableColumn = GenericTableColumn<CollectionRowData>;

const pendingDeletionCellLayout = (
  row: CollectionRowData,
): string | undefined =>
  row.isPendingDeletion ? "flex h-full w-full items-center" : undefined;

export const useCollectionTableColumns = () => {
  const { t } = useTranslation("collections-list");

  const columnNameAndDescription: TableColumn = {
    id: "collection-column-name",
    type: "custom",
    align: "start",
    header: t("table.headers.name"),
    render: (row) => {
      const hasCover = Boolean(row.thumbnailUrl?.trim());
      return (
        <div className={pendingDeletionCellLayout(row)}>
          <div className="flex w-full min-w-0 items-center gap-xs overflow-hidden py-2xs">
            <Avatar
              shape="squared"
              size="md"
              src={hasCover ? row.thumbnailUrl : undefined}
              alt={hasCover ? row.name : ""}
              iconName={hasCover ? undefined : "image-03"}
              className={
                row.isPendingDeletion ? "shrink-0 opacity-80" : "shrink-0"
              }
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2xs overflow-hidden">
              <Body
                htmlVariant="span"
                size="lg"
                color={row.isPendingDeletion ? "weaker" : "default"}
                className="block max-w-[320px] min-w-0 truncate"
              >
                {row.name}
              </Body>
              {row.description ? (
                <Body
                  htmlVariant="span"
                  size="md"
                  color={row.isPendingDeletion ? "weaker" : "weak"}
                  className="max-w-[320px] min-w-0 break-words whitespace-pre-wrap"
                >
                  {row.description}
                </Body>
              ) : null}
            </div>
          </div>
        </div>
      );
    },
  };

  const columnVideosCount: TableColumn = {
    id: "collection-column-videos-count",
    type: "custom",
    align: "center",
    header: (
      <span className="sr-only" aria-label={t("table.headers.videosCount")}>
        {t("table.headers.videosCount")}
      </span>
    ),
    render: (row) => (
      <div className={pendingDeletionCellLayout(row)}>
        <Body
          htmlVariant="span"
          size="md"
          color={row.isPendingDeletion ? "weaker" : "default"}
        >
          {t("table.videosCountLabel", { count: row.videosCount })}
        </Body>
      </div>
    ),
  };

  const columnActions: TableColumn = {
    id: "collection-column-actions",
    type: "custom",
    align: "center",
    header: (
      <span className="sr-only" aria-label={t("table.headers.actions")}>
        {t("table.headers.actions")}
      </span>
    ),
    render: (row) => (
      <div className={pendingDeletionCellLayout(row)}>
        <div className="flex min-w-[88px] items-center justify-end gap-2xs">
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
      </div>
    ),
  };

  return [columnNameAndDescription, columnVideosCount, columnActions];
};
