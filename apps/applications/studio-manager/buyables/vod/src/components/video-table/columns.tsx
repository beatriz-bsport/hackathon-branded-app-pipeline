import {
  Avatar,
  Body,
  Chip,
  type GenericTableColumn,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { VideoRowData } from "./types";

type TableColumn = GenericTableColumn<VideoRowData>;

const renderTooltipIcon = (
  icon:
    | "book-closed"
    | "clock-rewind"
    | "infinity"
    | "shopping-cart-01"
    | "shopping-cart-cross"
    | "video-recorder",
  label: string,
) => (
  <Tooltip label={label} placement="bottom">
    <Chip color="default" size="lg" type="weak" iconLeft={icon} />
  </Tooltip>
);

export const useVideoTableColumns = () => {
  const { t } = useTranslation("media-list");
  const tableValues = t("table.values") as {
    noCategory: string;
    noFile: string;
  };

  const columnName: TableColumn = {
    id: "video-column-name",
    type: "custom",
    align: "start",
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
    header: t("table.headers.format"),
    render: (row) => {
      if (row.format === "ebook") {
        return renderTooltipIcon(
          "book-closed",
          t("table.tooltips.format.ebookUploaded"),
        );
      }

      if (row.format === "video") {
        return renderTooltipIcon(
          "video-recorder",
          t("table.tooltips.format.videoUploaded"),
        );
      }

      return (
        <Tooltip
          label={t("table.tooltips.format.noFileUploaded")}
          placement="bottom"
        >
          <Chip
            color="default"
            size="lg"
            type="weak"
            iconLeft="video-recorder"
            label={tableValues.noFile}
          />
        </Tooltip>
      );
    },
  };

  const columnAvailability: TableColumn = {
    id: "video-column-availability",
    type: "custom",
    align: "center",
    header: t("table.headers.availability"),
    render: (row) => (
      <div className="flex items-center justify-center gap-xs">
        {renderTooltipIcon(
          row.memberAvailability === "available"
            ? "shopping-cart-01"
            : "shopping-cart-cross",
          row.memberAvailability === "available"
            ? t("table.tooltips.availability.availableToMembers")
            : t("table.tooltips.availability.unavailableToMembers"),
        )}
        {row.accessType === "limited"
          ? renderTooltipIcon(
              "clock-rewind",
              t("table.tooltips.availability.limitedTimeOnly"),
            )
          : renderTooltipIcon(
              "infinity",
              t("table.tooltips.availability.unlimitedAccess"),
            )}
      </div>
    ),
  };

  return [columnName, columnCategory, columnFormat, columnAvailability];
};
