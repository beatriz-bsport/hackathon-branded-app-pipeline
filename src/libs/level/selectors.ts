import { createSelector } from 'reselect';
import memoize from 'memoize-one';

import { RootState } from '../../reducers';
import { LevelState } from './types';
import { Offer } from '../../api/types';

const getState = (state: RootState): LevelState => state.level;

const _getLevelsDetails = (state: RootState) => getState(state).byId;

const _getLevelsList = (state: RootState) => getState(state).allIds;

export const getLevelById = (state: RootState) => (id: number) => {
  return getState(state).byId[id];
};

export const getAllCustomLevels = createSelector(
  [_getLevelsList, _getLevelsDetails],
  (ids, data) => {
    return ids.map((id) => data[id]);
  },
);

export const getActiveCustomLevels = createSelector(
  [_getLevelsList, _getLevelsDetails],
  (ids, data) => {
    return ids.map((id) => data[id]).filter((l) => l.enabled);
  },
);

export const getLevelsIsLoading = (state: RootState) => getState(state).loading;
export const getLevelsError = (state: RootState) => getState(state).error;

export const withCustomLevel = memoize(
  (selector: (state: RootState) => Offer) =>
    createSelector([selector, _getLevelsDetails], (offer, customLevelData) => {
      if (!offer) return offer;
      if (Array.isArray(offer)) {
        return offer.map((o) => ({
          ...o,
          customLevel: customLevelData[o.custom_level],
        }));
      }
      return {
        ...offer,
        customLevel: customLevelData[offer.custom_level],
      };
    }),
);
