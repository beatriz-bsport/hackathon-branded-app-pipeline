import {
  Avatar,
  Body,
  Button,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MediaActionsDropdown } from "./media-actions-dropdown";
import { MediaFormatRenderer } from "./media-format-renderer";
import type { VideoRowData } from "./types";

type TableColumn = GenericTableColumn<VideoRowData>;

export const useVideoTableColumns = ({
  onRequestUpload,
}: {
  onRequestUpload: (id: number) => void;
}) => {
  const { t } = useTranslation("media-list");

  const columnName: TableColumn = {
    id: "video-column-name",
    type: "custom",
    align: "start",
    colClassName: "w-full",
    header: t("table.headers.name"),
    render: (row) => {
      const hasCover = Boolean(row.thumbnailUrl?.trim());
      return (
        <div className="flex min-w-0 items-center gap-sm">
          <Avatar
            shape="squared"
            size="lg"
            src={hasCover ? row.thumbnailUrl : undefined}
            alt={hasCover ? row.name : ""}
            iconName={hasCover ? undefined : "image-03"}
            className="border-none"
          />
          <Body
            htmlVariant="span"
            size="md"
            color="default"
            className="block min-w-0 max-w-[320px] truncate"
          >
            {row.name}
          </Body>
        </div>
      );
    },
  };

  const columnCategory: TableColumn = {
    id: "video-column-category",
    type: "custom",
    align: "start",
    colClassName: "px-md",
    header: t("table.headers.category"),
    render: (row) => (
      <Body htmlVariant="span" size="md" color="default">
        {row.categoryLabel || t("table.values.noCategory")}
      </Body>
    ),
  };

  const columnFormat: TableColumn = {
    id: "video-column-format",
    type: "custom",
    align: "center",
    colClassName: "px-md",
    header: t("table.headers.format"),
    render: (row) => <MediaFormatRenderer format={row.format} />,
  };

  const columnAvailability: TableColumn = {
    id: "video-column-availability",
    type: "custom",
    align: "center",
    colClassName: "px-md",
    header: t("table.headers.availability"),
    render: (row) => (
      <div className="flex items-center justify-center gap-xs">
        <Tooltip
          label={
            row.memberAvailability === "available"
              ? t("table.tooltips.availability.availableToMembers")
              : t("table.tooltips.availability.unavailableToMembers")
          }
          placement="bottom"
        >
          <Chip
            color="default"
            size="lg"
            type="weak"
            iconLeft={
              row.memberAvailability === "available"
                ? "shopping-cart-01"
                : "shopping-cart-cross"
            }
          />
        </Tooltip>
        <Tooltip
          label={
            row.accessType === "limited"
              ? t("table.tooltips.availability.limitedTimeOnly")
              : t("table.tooltips.availability.unlimitedAccess")
          }
          placement="bottom"
        >
          <Chip
            color="default"
            size="lg"
            type="weak"
            iconLeft={
              row.accessType === "limited" ? "clock-rewind" : "infinity"
            }
          />
        </Tooltip>
      </div>
    ),
  };

  const columnActions: TableColumn = {
    id: "video-column-actions",
    type: "custom",
    align: "end",
    colClassName: "min-w-[128px] px-md",
    header: (
      <span className="sr-only" aria-label={t("table.headers.actions")}>
        {t("table.headers.actions")}
      </span>
    ),
    render: (row) => (
      <div className="flex min-w-[56px] items-center justify-end gap-2xs">
        {row.format === "none" ? (
          <Button
            color="main"
            intent="default"
            size="md"
            kind="default"
            iconLeft="upload-cloud-02"
            label={t("table.actions.upload")}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onRequestUpload(row.id);
            }}
          />
        ) : null}
        <MediaActionsDropdown
          onDuplicate={row.onDuplicate}
          onDelete={row.onDelete}
          onEdit={row.onEdit}
        />
      </div>
    ),
  };

  return [
    columnName,
    columnCategory,
    columnFormat,
    columnAvailability,
    columnActions,
  ];
};
