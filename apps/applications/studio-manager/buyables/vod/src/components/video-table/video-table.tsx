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

import { useTranslation } from "#src/utils/i18n";

import { useVideoTableColumns } from "./columns";
import type { VideoRowData } from "./types";
import { VideoList } from "./video-list";

type VideoTableProps = {
  videos: Video[];
  categoriesById: Map<number, string>;
  paginationProps: PaginationProps;
  isEmpty: boolean;
  isLoading?: boolean;
};

export const VideoTable: FC<VideoTableProps> = ({
  videos,
  categoriesById,
  paginationProps,
  isEmpty,
  isLoading = false,
}) => {
  const { t } = useTranslation("media-list");

  const emptyConfig: UseEmptyStateProps["emptyConfig"] = {
    title: t("table.emptyList.title"),
    subtitle: t("table.emptyList.subtitle"),
  };

  const emptyStateProps: UseEmptyStateProps = {
    isEmpty,
    emptyConfig,
  };

  const columns = useVideoTableColumns();
  const isMobile = !useMatchMedia("sm");

  const rows: VideoRowData[] = videos.map((video) => {
    const isEbook = video.provider_identifier === VideoProvider.EBOOK_PROVIDER;
    const format = isEbook
      ? "ebook"
      : video.status === VideoStatusEnum.processed
        ? "video"
        : "none";
    const trimmedCoverMain = video.cover_main?.trim();

    return {
      id: video.id,
      name: video.name,
      thumbnailUrl: trimmedCoverMain ? trimmedCoverMain : undefined,
      categoryLabel:
        video.SCT !== undefined && video.SCT !== null
          ? categoriesById.get(video.SCT)
          : undefined,
      format,
      memberAvailability: video.manager_only ? "unavailable" : "available",
      accessType: video.rental_days > 0 ? "limited" : "unlimited",
    };
  });

  if (isMobile) {
    return (
      <VideoList
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
