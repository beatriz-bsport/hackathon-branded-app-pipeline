import type { FC } from "react";

import { type Video, VideoProvider } from "@bsport/api-buyables/video";
import { Body, Button, Icon, Title } from "@bsport/kaizen-primitive-core";

import { MediaMetadataBadges } from "#src/components/media-common/media-metadata-badges";
import { MediaPlayerArea } from "#src/components/media-common/media-player-area";
import { MediaTeacherList } from "#src/components/media-common/media-teacher-list";
import { usePlaybackUrlQuery } from "#src/hooks/api/use-playback-url-query";
import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { formatVideoDuration } from "#src/utils/format-video-duration";
import { useTranslation } from "#src/utils/i18n";
import { resolveTeacherEntries } from "#src/utils/resolve-teacher-entries";

type CollectionVideoPreviewProps = {
  categoriesById: Map<number, string>;
  emptyThumbnailLabel: string;
  levelsById: Map<number, { label: string; color: string }>;
  teachersByAssociatedCoachId: Map<number, TeacherPreview>;
  video: Video | null;
};

export const CollectionVideoPreview: FC<CollectionVideoPreviewProps> = ({
  categoriesById,
  emptyThumbnailLabel,
  levelsById,
  teachersByAssociatedCoachId,
  video,
}) => {
  const { t } = useTranslation("collection-details");

  const isEbook = video?.provider_identifier === VideoProvider.EBOOK_PROVIDER;
  const playbackVideoId = video ? video.id : null;
  const playbackUrlQuery = usePlaybackUrlQuery(playbackVideoId);
  const durationLabel =
    video && !isEbook ? formatVideoDuration(video.duration_second) : undefined;
  const playbackUrl = playbackUrlQuery.data;
  const isPlaybackUrlLoading =
    playbackVideoId !== null &&
    (playbackUrlQuery.isPending || playbackUrlQuery.isFetching) &&
    !playbackUrl;
  const videoDescription = video?.description?.trim();
  const title = video?.name || emptyThumbnailLabel;
  const thumbnailUrl = video?.cover_main ?? "";
  const handleEbookDownload = () => {
    if (!playbackUrl) {
      return;
    }

    window.open(playbackUrl, "_blank", "noopener,noreferrer");
  };
  const categoryLabel = video?.SCT ? categoriesById.get(video.SCT) : undefined;
  const levelLabel = video?.level
    ? levelsById.get(video.level)?.label
    : undefined;
  const rentalDaysLabel =
    video && video.rental_days > 0
      ? t("videoList.rentalDays", { count: video.rental_days })
      : undefined;
  const teacherEntries = video
    ? resolveTeacherEntries(video.coaches, teachersByAssociatedCoachId)
    : [];

  return (
    <section className="flex h-full flex-col">
      <div className="flex w-full flex-col">
        <div className="w-full mx-auto px-lg">
          <MediaPlayerArea
            isEbook={isEbook}
            playbackUrl={playbackUrl}
            isPlaybackUrlLoading={isPlaybackUrlLoading}
            thumbnailUrl={thumbnailUrl}
            title={title}
            providerIdentifier={
              video?.provider_identifier ?? VideoProvider.AWS_PROVIDER
            }
          />
        </div>
        <div className="w-full px-lg py-md">
          <div className="flex items-start justify-between gap-md">
            <Title
              htmlVariant="h5"
              weight="strong"
              color="default"
              className="min-w-0 flex-1 text-left"
            >
              {title}
            </Title>
            {isEbook ? (
              <Button
                label={t("ebook.download")}
                intent="default"
                color="main"
                size="md"
                iconLeft="download-01"
                disabled={!playbackUrl}
                className="shrink-0"
                onClick={handleEbookDownload}
              />
            ) : null}
          </div>
          <MediaMetadataBadges
            durationLabel={durationLabel}
            levelLabel={levelLabel}
            categoryLabel={categoryLabel}
            rentalDaysLabel={rentalDaysLabel}
          />
          {video?.manager_only ? (
            <div className="mt-md flex items-center gap-xs text-onsurface-weak">
              <Icon icon="eye-off" size="sm" />
              <Body htmlVariant="span" size="md" color="weak">
                {t("videoList.managerOnly")}
              </Body>
            </div>
          ) : null}
          <MediaTeacherList teacherEntries={teacherEntries} />
          {videoDescription ? (
            <Body
              htmlVariant="p"
              size="md"
              weight="weak"
              color="default"
              className="mt-xs w-full text-left text-onsurface-weak whitespace-pre-wrap"
            >
              {videoDescription}
            </Body>
          ) : null}
        </div>
      </div>
    </section>
  );
};
