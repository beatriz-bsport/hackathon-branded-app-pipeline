import type { FC } from "react";

import {
  type Video,
  VideoProvider,
  VideoStatusEnum,
} from "@bsport/api-buyables/video";
import {
  type PaginationProps,
  Table,
  type UseEmptyStateProps,
  useMatchMedia,
} from "@bsport/kaizen-primitive-core";

import { usePendingVideoDeletionIds } from "#src/hooks/use-pending-video-deletions";
import { useTranslation } from "#src/utils/i18n";

import { useVideoTableColumns } from "./columns";
import type { VideoRowData } from "./types";
import { VideoList } from "./video-list";

type VideoTableProps = {
  videos: Video[];
  categoriesById: Map<number, string>;
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isEmptySearch?: boolean;
  emptySearchConfig?: UseEmptyStateProps["emptySearchConfig"];
  isLoading?: boolean;
  onRowClick?: (id: number) => void;
  onDuplicate: (video: Video) => void;
  onDelete: (video: Video) => void;
  onEdit?: (video: Video) => void;
};

export const VideoTable: FC<VideoTableProps> = ({
  videos,
  categoriesById,
  paginationProps,
  isEmpty,
  isEmptySearch = false,
  emptySearchConfig,
  isLoading = false,
  onRowClick,
  onDuplicate,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation("media-list");

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
  };

  const emptyStateProps: UseEmptyStateProps = {
    isEmpty,
    emptyConfig,
    isEmptySearch,
    emptySearchConfig,
  };

  const columns = useVideoTableColumns();
  const isMobile = !useMatchMedia("sm");
  const pendingDeletionIds = usePendingVideoDeletionIds();

  const rows: VideoRowData[] = videos.map((video) => {
    const isPendingDeletion = pendingDeletionIds.has(video.id);
    const isEbook = video.provider_identifier === VideoProvider.EBOOK_PROVIDER;
    const format = isEbook
      ? "ebook"
      : video.status === VideoStatusEnum.processed
        ? "video"
        : "none";
    const trimmedCoverMain = video.cover_main?.trim();

    return {
      id: video.id,
      className: isPendingDeletion ? "bg-surface-default-weak" : undefined,
      name: video.name,
      thumbnailUrl: trimmedCoverMain ? trimmedCoverMain : undefined,
      categoryLabel:
        video.SCT !== undefined && video.SCT !== null
          ? categoriesById.get(video.SCT)
          : undefined,
      format,
      memberAvailability: video.manager_only ? "unavailable" : "available",
      accessType: video.rental_days > 0 ? "limited" : "unlimited",
      isPendingDeletion,
      onRowClick: isPendingDeletion ? undefined : () => onRowClick?.(video.id),
      onDuplicate: () => onDuplicate(video),
      onDelete: () => onDelete(video),
      onEdit: () => onEdit?.(video),
    };
  });

  if (isMobile) {
    return (
      <VideoList
        rows={rows}
        paginationProps={paginationProps}
        isEmpty={isEmpty}
        isEmptySearch={isEmptySearch}
        emptyConfig={emptyConfig}
        emptySearchConfig={emptySearchConfig}
        isLoading={isLoading}
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
