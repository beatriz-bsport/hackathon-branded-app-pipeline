import { createSelector } from 'reselect';

import type { RootState } from '#src/reducers';

const _getWellhubAllUuids = (state: RootState) => state.wellhub.allUuids;
const _getWellhubByUuid = (state: RootState) => state.wellhub.byUuid;

export const getWellhubLoading = (state: RootState) => state.wellhub.loading;
export const getWellhubError = (state: RootState) => state.wellhub.error;

export const getWellhubGyms = createSelector(
  [_getWellhubAllUuids, _getWellhubByUuid],
  (uuids, byUuid) =>
    uuids.map((_uuid) => byUuid[_uuid]).filter((wellhubGym) => !!wellhubGym),
);

export const getWellhubGym = (state: RootState, uuid: string) =>
  _getWellhubByUuid(state)[uuid];

export const getWellhubGymAvailabilityLoading = (state: RootState) =>
  state.wellhub.gymAvailability.loading;
export const getWellhubGymAvailabilityError = (state: RootState) =>
  state.wellhub.gymAvailability.error;

export const getWellhubGymAvailability = (state: RootState, gym_id: number) =>
  state.wellhub.gymAvailability.record[gym_id];

export const getOffersMissingWellhubProductLoading = (state: RootState) =>
  state.wellhub.offersMissingProduct.loading;

export const getOffersMissingWellhubProductPaginatedData = (state: RootState) =>
  state.wellhub.offersMissingProduct.data;
