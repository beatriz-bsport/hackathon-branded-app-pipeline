import type { FC } from "react";

import {
  List,
  type ListProps,
  type PaginationProps,
  type UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";
import { Icon, Tooltip } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { MediaFormatRenderer } from "./media-format-renderer";
import type { VideoRowData } from "./types";

type VideoListProps = {
  rows: VideoRowData[];
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isLoading: boolean;
  emptyConfig: UseEmptyStateProps["emptyConfig"];
};

const TooltipIcon: FC<{
  icon:
    | "clock-rewind"
    | "infinity"
    | "shopping-cart-01"
    | "shopping-cart-cross";
  label: string;
}> = ({ icon, label }) => (
  <Tooltip label={label} placement="bottom">
    <span className="inline-flex">
      <Icon icon={icon} size="sm" className="text-onsurface-weak" />
    </span>
  </Tooltip>
);

export const VideoList: FC<VideoListProps> = ({
  rows,
  paginationProps,
  isEmpty,
  isLoading,
  emptyConfig,
}) => {
  const { t } = useTranslation("media-list");

  const items: ListProps["items"] = rows.map((row) => {
    const hasCover = Boolean(row.thumbnailUrl?.trim());

    return {
      id: `video-${row.id}`,
      title: row.name,
      description: row.categoryLabel || t("table.values.noCategory"),
      onItemClick: row.onRowClick,
      avatar: {
        shape: "squared" as const,
        size: "md" as const,
        src: hasCover ? row.thumbnailUrl : undefined,
        alt: hasCover ? row.name : "",
        iconName: hasCover ? undefined : "image-03",
        className: "cursor-default border-stroke-thin",
      },
      customNode: (
        <div className="flex items-center gap-xs">
          <MediaFormatRenderer format={row.format} />
          <TooltipIcon
            icon={
              row.memberAvailability === "available"
                ? "shopping-cart-01"
                : "shopping-cart-cross"
            }
            label={t(
              row.memberAvailability === "available"
                ? "table.tooltips.availability.availableToMembers"
                : "table.tooltips.availability.unavailableToMembers",
            )}
          />
          {row.accessType === "limited" ? (
            <TooltipIcon
              icon="clock-rewind"
              label={t("table.tooltips.availability.limitedTimeOnly")}
            />
          ) : (
            <TooltipIcon
              icon="infinity"
              label={t("table.tooltips.availability.unlimitedAccess")}
            />
          )}
        </div>
      ),
      buttons: [
        {
          id: "duplicate",
          kind: "icon-button" as const,
          icon: "copy-03" as const,
          color: "default" as const,
          intent: "flat" as const,
          label: t("table.actions.duplicate"),
          size: "md",
          onClick: row.onDuplicate,
        },
      ],
      dropdownConfig: {
        visibleActionsDisplayLimit: 0,
        dropdownTargetProps: {
          kind: "icon-button",
          label: t("table.actions.moreActions"),
          icon: "dots-vertical",
          size: "md",
          intent: "flat",
          color: "default",
        },
      },
    };
  });

  return (
    <List
      id="video-mobile-list"
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
