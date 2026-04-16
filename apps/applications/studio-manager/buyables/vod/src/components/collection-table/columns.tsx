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
              className="block max-w-[320px] min-w-0 truncate"
            >
              {row.name}
            </Body>
            {row.description ? (
              <Body
                htmlVariant="span"
                size="md"
                color="weak"
                className="max-w-[320px] min-w-0 break-words whitespace-pre-wrap"
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
    header: (
      <span className="sr-only" aria-label={t("table.headers.actions")}>
        {t("table.headers.actions")}
      </span>
    ),
    render: (row) =>
      row.onEdit ? (
        <Button
          color="default"
          intent="flat"
          size="md"
          kind="icon-button"
          icon="edit-02"
          label={t("table.actions.edit")}
          onClick={row.onEdit}
        />
      ) : null,
  };

  return [columnNameAndDescription, columnVideosCount, columnActions];
};
