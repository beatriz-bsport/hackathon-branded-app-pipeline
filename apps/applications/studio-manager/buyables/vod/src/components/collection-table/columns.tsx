import {
  Avatar,
  Body,
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
        <div className="flex min-w-0 items-center gap-xs py-2xs">
          <Avatar
            shape="squared"
            size="md"
            src={hasCover ? row.thumbnailUrl : undefined}
            alt={hasCover ? row.name : ""}
            iconName={hasCover ? undefined : "image-03"}
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2xs">
            <Body
              htmlVariant="span"
              size="lg"
              color="default"
              className="min-w-0 truncate"
            >
              {row.name}
            </Body>
            {row.description ? (
              <Body
                htmlVariant="span"
                size="md"
                color="weak"
                className="line-clamp-2 min-w-0 break-words"
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
    header: "",
    render: (row) => (
      <Body htmlVariant="span" size="md" color="default">
        {t("table.videosCountLabel", { count: row.videosCount })}
      </Body>
    ),
  };

  return [columnNameAndDescription, columnVideosCount];
};
