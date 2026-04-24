import type { FC } from "react";
import { useParams } from "react-router";

import { CollectionDetailsFetchError } from "#src/components/collection-details/collection-details-fetch-error";
import { DetailsNotFound } from "#src/components/collection-details/collection-details-not-found";
import { QueryBoundary } from "#src/components/query-boundary";
import { useCollectionQuery } from "#src/hooks/api/use-collection-query";
import { useCollectionVideosQuery } from "#src/hooks/api/use-collection-videos-query";

import CollectionDetailsPage from "./collection-details-page";

type CollectionDetailsEntryInnerProps = {
  collectionId: number;
};

const CollectionDetailsEntryInner: FC<CollectionDetailsEntryInnerProps> = ({
  collectionId,
}) => {
  const { data } = useCollectionQuery(collectionId);
  const { data: collectionVideos = [] } = useCollectionVideosQuery(
    data?.videos,
  );

  return <CollectionDetailsPage collection={data} videos={collectionVideos} />;
};

export const CollectionDetailsEntry: FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const parsedId = collectionId ? Number(collectionId) : NaN;

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return <DetailsNotFound />;
  }

  return (
    <QueryBoundary
      errorFallback={(props) => <CollectionDetailsFetchError {...props} />}
    >
      <CollectionDetailsEntryInner collectionId={parsedId} />
    </QueryBoundary>
  );
};
