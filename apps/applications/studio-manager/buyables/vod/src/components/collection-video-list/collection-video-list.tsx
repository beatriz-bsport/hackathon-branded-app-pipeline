import type { FC } from "react";

import { type Video, VideoProvider } from "@bsport/api-buyables/video";
import {
  Body,
  Card,
  Divider,
  List,
  Title,
  Tooltip,
} from "@bsport/kaizen-primitive-core";

import { formatVideoDuration } from "#src/utils/format-video-duration";
import { useTranslation } from "#src/utils/i18n";

import {
  type CollectionDetailsSidebarListItem,
  CollectionDetailsSidebarListItemRenderer,
} from "./collection-details-sidebar-list-item-renderer";

type CollectionVideoListProps = {
  collectionDescription?: string;
  videos: Video[];
  onSelectVideo: (videoId: number) => void;
  selectedVideoId: number | null;
};

export const CollectionVideoList: FC<CollectionVideoListProps> = ({
  collectionDescription,
  videos,
  onSelectVideo,
  selectedVideoId,
}) => {
  const { t } = useTranslation(["collections-list", "collection-details"]);
  const items: CollectionDetailsSidebarListItem[] = videos.map((video) => {
    const hasCover = Boolean(video.cover_main?.trim());
    const isEbook = video.provider_identifier === VideoProvider.EBOOK_PROVIDER;

    return {
      id: `collection-video-${video.id}`,
      title: video.name,
      durationLabel: isEbook
        ? undefined
        : formatVideoDuration(video.duration_second),
      thumbnailUrl: hasCover ? video.cover_main : undefined,
      isEbook,
      isActive: selectedVideoId === video.id,
      onItemClick: () => onSelectVideo(video.id),
    };
  });

  return (
    <section className="flex h-full min-h-0 flex-col gap-sm">
      <div className="flex flex-col items-center gap-sm bg-surface-default-weaker px-md py-sm">
        <Title
          htmlVariant="h5"
          weight="strong"
          color="default"
          className="w-full text-justify"
        >
          {t("table.videosCountLabel", {
            count: videos.length,
            ns: "collections-list",
          })}
        </Title>
        {collectionDescription ? (
          // NOTE: This is a workaround to force the tooltip to be displayed as a block element.
          // TODO: Remove this once we can style the tooltip's anchor directly.
          <div className="w-full [&_[data-component=Kaizen-Tooltip]]:block [&_[data-component=Kaizen-Tooltip]]:w-full [&_[data-component=Kaizen-Tooltip]>div]:block [&_[data-component=Kaizen-Tooltip]>div]:w-full">
            <Tooltip
              label={collectionDescription}
              placement="bottom"
              className="block w-full"
            >
              <Body
                htmlVariant="span"
                size="sm"
                weight="weak"
                color="default"
                className="block w-full truncate"
              >
                {collectionDescription}
              </Body>
            </Tooltip>
          </div>
        ) : null}
      </div>
      <Divider orientation="horizontal" weight="extra-thin" />
      <Card padding="none" className="min-h-0 flex-1 overflow-y-auto">
        <List
          id="collection-video-list"
          items={items}
          ListItem={CollectionDetailsSidebarListItemRenderer}
          emptyStateProps={{
            isEmpty: items.length === 0,
            emptyConfig: {
              title: t("emptyMedia.title", { ns: "collection-details" }),
              subtitle: t("emptyMedia.subtitle", { ns: "collection-details" }),
              className: "px-md",
            },
          }}
        />
      </Card>
    </section>
  );
};
