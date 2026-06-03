import { type FC, Fragment, useMemo } from "react";
import { Link } from "react-router";

import type { Establishment } from "@bsport/api-book";
import { Body } from "@bsport/kaizen-primitive-core";

import { ABSOLUTE_ROUTES } from "#src/urls";
import { groupVenuesByCoordinates } from "#src/utils/group-venues";

import { type LatLng, MapPin, MapView } from "./";

type Props = {
  venues: Establishment[];
  height?: number;
  onMarkerClick?: (venue: Establishment) => void;
};

export const VenuesMap: FC<Props> = ({
  venues,
  height = 360,
  onMarkerClick,
}) => {
  const groups = useMemo(() => groupVenuesByCoordinates(venues), [venues]);
  const bounds = useMemo<LatLng[]>(
    () => groups.map((group) => [group.latitude, group.longitude]),
    [groups],
  );

  return (
    <MapView bounds={bounds} height={height}>
      {groups.map((group) => {
        const id = group.venues.map((venue) => venue.id).join(",");
        const description = group.venues[0].location.address;
        return (
          <MapPin
            key={id}
            position={[group.latitude, group.longitude]}
            onClick={
              onMarkerClick ? () => onMarkerClick(group.venues[0]) : undefined
            }
          >
            <Body size="lg" weight="strong">
              {group.venues.map((venue, venueIndex) => (
                <Fragment key={venue.id}>
                  <Link
                    className="text-inherit underline-offset-2 hover:underline"
                    to={ABSOLUTE_ROUTES.DETAIL(venue.id)}
                    onClick={(event) => event.stopPropagation()}
                  >
                    {venue.title}
                  </Link>
                  {venueIndex < group.venues.length - 1 ? ", " : null}
                </Fragment>
              ))}
            </Body>
            {description && (
              <Body size="md" weight="weak">
                {description}
              </Body>
            )}
          </MapPin>
        );
      })}
    </MapView>
  );
};
