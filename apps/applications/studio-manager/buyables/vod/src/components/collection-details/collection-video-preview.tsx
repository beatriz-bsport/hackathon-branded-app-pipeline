import type { FC } from "react";

import { type Video, VideoProvider } from "@bsport/api-buyables/video";
import {
  Avatar,
  Badge,
  Body,
  Button,
  Icon,
  Loader,
  Media,
  Title,
} from "@bsport/kaizen-primitive-core";

import { EbookPreview } from "#src/components/video-player/ebook-preview";
import { VideoPlayer } from "#src/components/video-player/video-player";
import { usePlaybackUrlQuery } from "#src/hooks/api/use-playback-url-query";
import type { TeacherPreview } from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { formatVideoDuration } from "#src/utils/format-video-duration";
import { getTeacherInitials } from "#src/utils/get-teacher-initials";
import { useTranslation } from "#src/utils/i18n";

type CollectionVideoPreviewProps = {
  categoriesById: Map<number, string>;
  emptyThumbnailLabel: string;
  levelsById: Map<number, string>;
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
  const levelLabel = video?.level ? levelsById.get(video.level) : undefined;
  const rentalDaysLabel =
    video && video.rental_days > 0
      ? t("videoList.rentalDays", { count: video.rental_days })
      : undefined;
  const teacherEntries = video
    ? Array.from(
        video.coaches.reduce((teachersByCoachId, coachId) => {
          const teacher = teachersByAssociatedCoachId.get(coachId);

          if (teacher && !teachersByCoachId.has(coachId)) {
            teachersByCoachId.set(coachId, teacher);
          }

          return teachersByCoachId;
        }, new Map<number, TeacherPreview>()),
      )
    : [];

  return (
    <section className="flex h-full flex-col items-center">
      <div className="flex w-full max-w-[720px] flex-col items-center">
        <div className="w-full px-lg">
          {video && isEbook ? (
            <EbookPreview coverUrl={thumbnailUrl} alt={title} />
          ) : video && playbackUrl ? (
            <div className="overflow-hidden rounded-sm">
              <VideoPlayer
                playbackUrl={playbackUrl as string}
                providerIdentifier={video.provider_identifier}
              />
            </div>
          ) : isPlaybackUrlLoading ? (
            <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-surface-default-weaker">
              <Loader size="xl" />
            </div>
          ) : (
            <Media
              src={thumbnailUrl}
              alt={title}
              ratio="16:9"
              className="w-full rounded-sm"
            />
          )}
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
          <div className="mt-xs flex flex-wrap items-center gap-xs">
            {durationLabel ? (
              <Badge
                size="lg"
                color="default"
                text={durationLabel}
                icon="clock"
              />
            ) : null}
            {levelLabel ? (
              <Badge
                size="lg"
                color="default"
                text={levelLabel}
                icon="graduation-hat-02"
              />
            ) : null}
            {categoryLabel ? (
              <Badge
                size="lg"
                color="default"
                text={categoryLabel}
                icon="tag-01"
              />
            ) : null}
            {rentalDaysLabel ? (
              <Badge
                size="lg"
                color="default"
                text={rentalDaysLabel}
                icon="play-circle-solid"
              />
            ) : null}
          </div>
          {video?.manager_only ? (
            <div className="mt-md flex items-center gap-xs text-onsurface-weak">
              <Icon icon="eye-off" size="sm" />
              <Body htmlVariant="span" size="md" color="weak">
                {t("videoList.managerOnly")}
              </Body>
            </div>
          ) : null}
          {teacherEntries.length > 0 ? (
            <div className="mt-md flex flex-wrap items-center gap-xs">
              {teacherEntries.map(([coachId, teacher]) => (
                <div
                  key={coachId}
                  className="flex items-center gap-xs rounded-full bg-surface-default-weak px-sm py-xs"
                >
                  <Avatar
                    shape="round"
                    size="sm"
                    src={teacher.photo ?? undefined}
                    alt={teacher.name}
                    initials={getTeacherInitials(teacher.name)}
                  />
                  <Body htmlVariant="span" size="md" color="default">
                    {teacher.name}
                  </Body>
                </div>
              ))}
            </div>
          ) : null}
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
