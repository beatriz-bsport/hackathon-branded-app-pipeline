import type { FC } from "react";

import { type Video, VideoProvider } from "@bsport/api-buyables/video";
import { Body, Divider, Icon } from "@bsport/kaizen-primitive-core";

import { MediaMetadataBadges } from "#src/components/media-common/media-metadata-badges";
import { MediaPlayerArea } from "#src/components/media-common/media-player-area";
import { MediaTeacherList } from "#src/components/media-common/media-teacher-list";
import { useCategoriesByIdQuery } from "#src/hooks/api/use-categories-by-id-query";
import { useLevelsByIdQuery } from "#src/hooks/api/use-levels-by-id-query";
import { usePlaybackUrlQuery } from "#src/hooks/api/use-playback-url-query";
import {
  type TeacherPreview,
  useTeachersByAssociatedCoachIdQuery,
} from "#src/hooks/api/use-teachers-by-associated-coach-id-query";
import { formatVideoDuration } from "#src/utils/format-video-duration";
import { useTranslation } from "#src/utils/i18n";
import { resolveTeacherEntries } from "#src/utils/resolve-teacher-entries";

type MediaDetailsPreviewProps = {
  media: Video;
};

export const MediaDetailsPreview: FC<MediaDetailsPreviewProps> = ({
  media,
}) => {
  const { t } = useTranslation("media-details");
  const { data: categoriesById = new Map<number, string>() } =
    useCategoriesByIdQuery();
  const {
    data: levelsById = new Map<number, { label: string; color: string }>(),
  } = useLevelsByIdQuery();
  const {
    data: teachersByAssociatedCoachId = new Map<number, TeacherPreview>(),
  } = useTeachersByAssociatedCoachIdQuery(media.coaches);
  const isEbook = media.provider_identifier === VideoProvider.EBOOK_PROVIDER;
  const {
    data: playbackUrl,
    isPending: isPlaybackUrlPending,
    isFetching: isPlaybackUrlFetching,
  } = usePlaybackUrlQuery(isEbook ? null : media.id);
  const isPlaybackUrlLoading =
    !isEbook && (isPlaybackUrlPending || isPlaybackUrlFetching) && !playbackUrl;
  const durationLabel = isEbook
    ? undefined
    : formatVideoDuration(media.duration_second);
  const levelLabel = media.level
    ? levelsById.get(media.level)?.label
    : undefined;
  const categoryLabel = media.SCT ? categoriesById.get(media.SCT) : undefined;
  const rentalDaysLabel =
    media.rental_days > 0
      ? t("rentalDays", { count: media.rental_days })
      : undefined;
  const teacherEntries = resolveTeacherEntries(
    media.coaches,
    teachersByAssociatedCoachId,
  );
  const videoDescription = media.description.trim();

  return (
    <section className="flex h-full flex-col items-center">
      <div className="flex w-full max-w-[720px] flex-col px-lg">
        <MediaPlayerArea
          isEbook={isEbook}
          playbackUrl={playbackUrl}
          isPlaybackUrlLoading={isPlaybackUrlLoading}
          thumbnailUrl={media.cover_main}
          title={media.name}
          providerIdentifier={media.provider_identifier}
        />
        <MediaMetadataBadges
          durationLabel={durationLabel}
          levelLabel={levelLabel}
          categoryLabel={categoryLabel}
          rentalDaysLabel={rentalDaysLabel}
        />
        {media.manager_only ? (
          <div className="mt-md flex items-center gap-xs text-onsurface-weak">
            <Icon icon="eye-off" size="sm" />
            <Body htmlVariant="span" size="md" color="weak">
              {t("managerOnly")}
            </Body>
          </div>
        ) : null}
        <MediaTeacherList teacherEntries={teacherEntries} />
        {videoDescription ? (
          <>
            <Divider
              orientation="horizontal"
              weight="extra-thin"
              className="mt-md"
            />
            <Body
              htmlVariant="p"
              size="md"
              weight="weak"
              color="default"
              className="mt-md w-full text-left text-onsurface-weak whitespace-pre-wrap"
            >
              {videoDescription}
            </Body>
          </>
        ) : null}
      </div>
    </section>
  );
};
