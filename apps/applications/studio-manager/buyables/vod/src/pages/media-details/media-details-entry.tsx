import type { FC } from "react";
import { useParams } from "react-router";

import { MediaDetailsFetchError } from "#src/components/media-details/media-details-fetch-error";
import { DetailsNotFound } from "#src/components/media-details/media-details-not-found";
import { QueryBoundary } from "#src/components/query-boundary";
import { useVideoQuery } from "#src/hooks/api/use-video-query";

import MediaDetailsPage from "./media-details-page";

type MediaDetailsEntryInnerProps = {
  mediaId: number;
};

const MediaDetailsEntryInner: FC<MediaDetailsEntryInnerProps> = ({
  mediaId,
}) => {
  const { data } = useVideoQuery(mediaId);

  return <MediaDetailsPage media={data} />;
};

export const MediaDetailsEntry: FC = () => {
  const { mediaId } = useParams<{ mediaId: string }>();
  const parsedId = mediaId ? Number(mediaId) : NaN;

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <DetailsNotFound />;
  }

  return (
    <QueryBoundary
      errorFallback={(props) => <MediaDetailsFetchError {...props} />}
    >
      <MediaDetailsEntryInner mediaId={parsedId} />
    </QueryBoundary>
  );
};

export default MediaDetailsEntry;
