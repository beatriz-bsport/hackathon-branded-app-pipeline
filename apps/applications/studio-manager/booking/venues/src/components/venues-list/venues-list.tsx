import { type FC, useMemo } from "react";

import { type Establishment } from "@bsport/api-book";
import { useEmptyState } from "@bsport/kaizen-primitive-core";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useVenuesListQuery } from "#src/hooks/api/use-venues-list-query";
import { groupVenuesByAddress } from "#src/utils/group-venues";
import { useTranslation } from "#src/utils/i18n";

import { VenueSection } from "./venue-section";

type VenuesListProps = {
  onArchive: (venue: Establishment) => void;
};

const VenuesListInner: FC<VenuesListProps> = ({ onArchive }) => {
  const { t } = useTranslation("venues-list");
  const { data: venuesData } = useVenuesListQuery();

  const venues = venuesData.results;
  const venueGroups = useMemo(() => groupVenuesByAddress(venues), [venues]);

  const emptyConfig = useMemo(
    () => ({
      title: t("emptyState.title"),
      ctaButtonConfig: {
        label: t("emptyState.cta"),
        iconLeft: "plus",
        onClick: () => {},
      },
    }),
    [t],
  );

  const { EmptyState, shouldRenderEmptyState } = useEmptyState({
    isEmpty: venues.length === 0,
    emptyConfig,
  });

  if (shouldRenderEmptyState) return <EmptyState />;

  return (
    <>
      {venueGroups.map(({ address, venues: addressVenues }) => (
        <VenueSection
          key={`venues-section-${address}`}
          address={address}
          venues={addressVenues}
          onArchive={onArchive}
        />
      ))}
    </>
  );
};

export const VenuesList: FC<VenuesListProps> = (props) => (
  <QueryBoundary loadingFallback={<CardLoader />}>
    <VenuesListInner {...props} />
  </QueryBoundary>
);
