import { useCallback, useMemo } from "react";

import type { Establishment, EstablishmentGroup } from "@bsport/api-book";
import { List, toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useEstablishmentGroupsQuery } from "#src/hooks/api/use-establishment-groups-query";
import { useUpdateLocation } from "#src/hooks/api/use-update-location";
import { buildVenueGroupMap } from "#src/utils/group-venues";
import { useTranslation } from "#src/utils/i18n";

import { buildVenueListItem } from "./venue-row";

type VenueSectionProps = {
  address: string;
  venues: Establishment[];
  onArchive: (venue: Establishment) => void;
  onEditLocation: (location: EstablishmentGroup) => void;
};

export const VenueSection = ({
  address,
  venues,
  onArchive,
  onEditLocation,
}: VenueSectionProps) => {
  const { t } = useTranslation("venues-list");
  const { data: groupsData } = useEstablishmentGroupsQuery();
  const { mutate: updateLocation } = useUpdateLocation();

  const multiLocalization =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

  const groups = groupsData.results;

  const groupMap = useMemo(() => buildVenueGroupMap(groups), [groups]);

  const availableLocationsByVenue = useMemo(
    () =>
      new Map(
        venues.map((venue) => [
          venue.id,
          groups.filter((group) => !group.establishment.includes(venue.id)),
        ]),
      ),
    [venues, groups],
  );

  const handleAddVenueToLocation = useCallback(
    (venue: Establishment, location: EstablishmentGroup) => {
      updateLocation(
        {
          id: location.id,
          payload: {
            name: location.name,
            establishment: [...location.establishment, venue.id],
          },
        },
        {
          onSuccess: () => {
            toast({
              status: "default",
              icon: "check",
              buttonIcon: "x-close",
              description: t("toasts.addVenueToLocation", {
                venue: venue.title,
                location: location.name,
              }),
            });
          },
        },
      );
    },
    [updateLocation, t],
  );

  const listId = `venues-section-${address}`;

  const labels = {
    addToGroup: t("groupTag.add"),
    editLocation: t("groupTag.edit"),
    edit: t("venueRow.edit"),
    archive: t("venueRow.archive"),
  };

  const items = venues.map((venue) =>
    buildVenueListItem(venue, {
      group: groupMap.get(venue.id),
      multiLocalization,
      availableLocations: availableLocationsByVenue.get(venue.id) ?? [],
      labels,
      onArchive,
      onAddVenueToLocation: handleAddVenueToLocation,
      onEditLocation,
    }),
  );

  return (
    <List
      id={listId}
      header={{
        id: `${listId}-header`,
        title: t("sectionCount", { address, count: venues.length }),
      }}
      collapsibleProps={{ initiallyOpen: true }}
      items={items}
    />
  );
};
