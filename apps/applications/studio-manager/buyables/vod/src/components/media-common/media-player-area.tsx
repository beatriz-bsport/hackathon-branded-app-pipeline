import type { FC } from "react";

import { type VideoProvider } from "@bsport/api-buyables/video";
import { Loader, Media } from "@bsport/kaizen-primitive-core";

import { EbookPreview } from "#src/components/video-player/ebook-preview";
import { VideoPlayer } from "#src/components/video-player/video-player";

type MediaPlayerAreaProps = {
  isEbook: boolean;
  playbackUrl: string | undefined;
  isPlaybackUrlLoading: boolean;
  thumbnailUrl: string;
  title: string;
  providerIdentifier: VideoProvider;
};

export const MediaPlayerArea: FC<MediaPlayerAreaProps> = ({
  isEbook,
  playbackUrl,
  isPlaybackUrlLoading,
  thumbnailUrl,
  title,
  providerIdentifier,
}) => {
  if (isEbook) {
    return <EbookPreview coverUrl={thumbnailUrl} alt={title} />;
  }

  if (playbackUrl) {
    return (
      <div className="overflow-hidden rounded-sm">
        <VideoPlayer
          playbackUrl={playbackUrl}
          providerIdentifier={providerIdentifier}
        />
      </div>
    );
  }

  if (isPlaybackUrlLoading) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-sm bg-surface-default-weaker">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <Media
      src={thumbnailUrl}
      alt={title}
      ratio="16:9"
      className="w-full rounded-sm"
    />
  );
};
