import { Navigate, useParams } from "react-router";

import { CardLoader } from "#src/components/query-boundary/fallbacks.js";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { VenueDetailShell } from "#src/components/venue-detail/venue-detail-shell";
import { useVenuesSearchQuery } from "#src/hooks/api/use-venues-search-query";
import { ABSOLUTE_ROUTES } from "#src/urls";

const VenueDetailContent = ({ id }: { id: number }) => {
  const { data } = useVenuesSearchQuery();
  const venue = data.results.find((entry) => entry.id === id);

  if (!venue) {
    return <Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />;
  }

  return <VenueDetailShell venue={venue} />;
};

const DetailPage = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const id = Number(venueId);

  if (!Number.isFinite(id) || id <= 0) {
    return <Navigate to={ABSOLUTE_ROUTES.ACTIVE} replace />;
  }

  return (
    <QueryBoundary loadingFallback={<CardLoader />}>
      <VenueDetailContent id={id} />
    </QueryBoundary>
  );
};

export default DetailPage;
