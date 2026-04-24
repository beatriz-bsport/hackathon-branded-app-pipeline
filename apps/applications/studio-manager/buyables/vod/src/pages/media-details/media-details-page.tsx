import type { FC } from "react";

import type { Video } from "@bsport/api-buyables/video";
import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";

import { MediaDetailsPanel } from "#src/components/media-details/media-details-panel";
import { MediaDetailsPreview } from "#src/components/media-details/media-details-preview";
import { useMediaDetailsHeader } from "#src/hooks/layout/use-media-details-header";

type MediaDetailsPageProps = {
  media: Video;
};

const MediaDetailsPage: FC<MediaDetailsPageProps> = ({ media }) => {
  const { detailsLayoutProps } = useDetailsLayout();
  const headerConfig = useMediaDetailsHeader();

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel>
      <DetailsLayout.Header pageTitle={media.name} {...headerConfig} />
      <DetailsLayout.Content className="flex flex-col gap-lg max-w-none">
        <MediaDetailsPreview media={media} />
      </DetailsLayout.Content>
      <DetailsLayout.Panel className="flex flex-col gap-sm">
        <MediaDetailsPanel media={media} />
      </DetailsLayout.Panel>
    </DetailsLayout>
  );
};

export default MediaDetailsPage;
