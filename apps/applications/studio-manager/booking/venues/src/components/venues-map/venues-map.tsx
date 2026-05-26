import { type FC, useMemo } from "react";

import type { Establishment } from "@bsport/api-book";
import { Body } from "@bsport/kaizen-primitive-core";

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
        const title = group.venues.map((venue) => venue.title).join(", ");
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
              {title}
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
