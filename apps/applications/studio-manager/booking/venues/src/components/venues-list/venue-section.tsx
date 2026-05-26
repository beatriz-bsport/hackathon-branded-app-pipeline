import { useCallback, useMemo } from "react";

import type { Establishment, EstablishmentGroup } from "@bsport/api-book";
import { List, toast } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { useUpdateLocation } from "#src/hooks/api/use-update-location";
import { useVenueGroupMap } from "#src/hooks/use-venue-group-map";
import { useTranslation } from "#src/utils/i18n";

import { buildVenueListItem } from "./venue-row";

type VenueSectionProps = {
  address: string;
  venues: Establishment[];
  onArchive: (venue: Establishment) => void;
  onEdit: (venue: Establishment) => void;
};

export const VenueSection = ({
  address,
  venues,
  onArchive,
  onEdit,
}: VenueSectionProps) => {
  const { t } = useTranslation("venues-list");
  const { groups, groupMap } = useVenueGroupMap();
  const { mutate: updateLocation } = useUpdateLocation();

  const multiLocalization =
    !!dataAccessLayer.useCompanyTheme()?.enable_multi_localization;

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
      onEdit,
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
