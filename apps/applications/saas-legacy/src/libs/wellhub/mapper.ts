import { PartnershipAccount } from '#src/libs/partnership/types';
import { WellhubGym } from './types';

export const mapWellhubGymToPartnershipAccount = (
  wellhubGym: WellhubGym,
): PartnershipAccount => ({
  id: wellhubGym.uuid,
  external_name: wellhubGym.gym_name,
  external_id: String(wellhubGym.gym_id),
  establishments: wellhubGym.establishments,
  legacyObject: wellhubGym,
});

export const mapWellhubGymsToPartnershipAccounts = (
  wellhubGyms: WellhubGym[],
): PartnershipAccount[] =>
  wellhubGyms.map((wellhubGym) =>
    mapWellhubGymToPartnershipAccount(wellhubGym),
  );
