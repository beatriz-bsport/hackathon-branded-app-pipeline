import type { FC } from "react";

import type { Video } from "@bsport/api-buyables/video";

import { QueryBoundary } from "#src/components/query-boundary";

import { MediaDetailsBuyersList } from "./media-details-buyers-list";
import { MediaDetailsViewersList } from "./media-details-viewers-list";
import { MediaDetailsViewingMetrics } from "./media-details-viewing-metrics";

type MediaDetailsPanelProps = {
  media: Video;
};

export const MediaDetailsPanel: FC<MediaDetailsPanelProps> = ({ media }) => {
  return (
    <div className="flex flex-col gap-xl">
      <QueryBoundary>
        <MediaDetailsViewingMetrics
          videoId={media.id}
          uploadedAt={media.date_created}
        />
      </QueryBoundary>
      <MediaDetailsViewersList videoId={media.id} />
      <MediaDetailsBuyersList videoId={media.id} />
    </div>
  );
};
