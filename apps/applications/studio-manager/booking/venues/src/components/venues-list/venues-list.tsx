import { type FC, useMemo } from "react";

import { type Establishment } from "@bsport/api-book";
import { useEmptyState } from "@bsport/kaizen-primitive-core";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useVenuesSearchQuery } from "#src/hooks/api/use-venues-search-query";
import { useVenueGroupMap } from "#src/hooks/use-venue-group-map";
import {
  type VenuesActiveFilters,
  filterVenues,
} from "#src/utils/filter-venues";
import { groupVenuesByAddress } from "#src/utils/group-venues";
import { useTranslation } from "#src/utils/i18n";

import { VenueSection } from "./venue-section";

type VenuesListProps = {
  searchQuery?: string;
  activeFilters: VenuesActiveFilters;
  onArchive: (venue: Establishment) => void;
};

const VenuesListInner: FC<VenuesListProps> = ({
  searchQuery = "",
  activeFilters,
  onArchive,
}) => {
  const { t } = useTranslation("venues-list");
  const { data: venuesData } = useVenuesSearchQuery({ q: searchQuery });
  const { groupMap } = useVenueGroupMap();

  const venues = venuesData.results;

  const filteredVenues = filterVenues(venues, activeFilters, groupMap);

  const hasActiveFilters =
    activeFilters.cities.length > 0 ||
    activeFilters.groupIds.length > 0 ||
    activeFilters.includeNoLocation;

  const isFiltered = searchQuery.length > 0 || hasActiveFilters;

  const emptyConfig = useMemo(
    () =>
      isFiltered
        ? {
            title: t("search.emptyState.title"),
            subtitle: t("search.emptyState.subtitle"),
          }
        : {
            title: t("emptyState.title"),
            ctaButtonConfig: {
              label: t("emptyState.cta"),
              iconLeft: "plus",
              onClick: () => {},
            },
          },
    [isFiltered, t],
  );

  const { EmptyState, shouldRenderEmptyState } = useEmptyState({
    isEmpty: filteredVenues.length === 0,
    emptyConfig,
  });

  if (shouldRenderEmptyState) return <EmptyState />;

  const venueGroups = groupVenuesByAddress(filteredVenues);

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
