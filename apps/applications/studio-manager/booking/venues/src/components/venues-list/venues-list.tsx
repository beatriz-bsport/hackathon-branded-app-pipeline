import { type FC, useMemo } from "react";

import { List, useEmptyState } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { CardLoader } from "#src/components/query-boundary/fallbacks";
import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useEstablishmentGroupsQuery } from "#src/hooks/api/use-establishment-groups-query";
import { useVenuesListQuery } from "#src/hooks/api/use-venues-list-query";
import {
  buildVenueGroupMap,
  groupVenuesByAddress,
} from "#src/utils/group-venues";
import { useTranslation } from "#src/utils/i18n";

import { buildVenueListItem } from "./venue-row";

const VenuesListInner: FC = () => {
  const { t } = useTranslation("venues-list");
  const { data: venuesData } = useVenuesListQuery();
  const { data: groupsData } = useEstablishmentGroupsQuery();

  const multiLoc =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

  const venues = venuesData.results;
  const groups = groupsData.results;

  const venueGroups = useMemo(() => groupVenuesByAddress(venues), [venues]);
  const groupMap = useMemo(() => buildVenueGroupMap(groups), [groups]);

  const addToGroupLabel = t("groupTag.add");

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
      {venueGroups.map(({ address, venues: addressVenues }) => {
        const listId = `venues-section-${address}`;
        return (
          <List
            key={listId}
            id={listId}
            header={{
              id: `${listId}-header`,
              title: t("sectionCount", {
                address,
                count: addressVenues.length,
              }),
            }}
            collapsibleProps={{ initiallyOpen: true }}
            items={addressVenues.map((venue) =>
              buildVenueListItem(venue, {
                groupName: groupMap.get(venue.id)?.name,
                multiLoc,
                addToGroupLabel,
                t,
              }),
            )}
          />
        );
      })}
    </>
  );
};

export const VenuesList: FC = () => (
  <QueryBoundary loadingFallback={<CardLoader />}>
    <VenuesListInner />
  </QueryBoundary>
);
