import { PartnershipVenue } from '#src/libs/partnership/types';
import { WellhubGym } from './types';

export const mapWellhubGymToPartnershipVenue = (
  wellhubGym: WellhubGym,
): PartnershipVenue => ({
  id: wellhubGym.uuid,
  external_name: wellhubGym.gym_name,
  external_id: String(wellhubGym.gym_id),
  establishments: wellhubGym.establishments,
  legacyObject: wellhubGym,
});

export const mapWellhubGymsToPartnershipVenues = (
  wellhubGyms: WellhubGym[],
): PartnershipVenue[] =>
  wellhubGyms.map((wellhubGym) => mapWellhubGymToPartnershipVenue(wellhubGym));
