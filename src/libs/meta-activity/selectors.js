// @flow
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import type { State } from '../../state/types';
import type { MetaActivity } from './types';

export const getMetaActivitiesDict = (state: State): Array<MetaActivity> =>
  state.metaActivity.byId;

export const getMetaActivitiesIdList = (state: State): Array<MetaActivity> =>
  state.metaActivity.allIds;

export const getMetaActivity = (state: State, id: number): MetaActivity =>
  state.metaActivity.byId[id];

export const getMetaActivities = createSelector(
  getMetaActivitiesDict,
  (metaActivities) => Immutable(Object.values(metaActivities)),
);

export const getEnabledMetaActivities = createSelector(
  getMetaActivitiesDict,
  (metactivities) =>
    Immutable(Object.values(metactivities)).filter(
      (ma) => !!ma.customer_enabled,
    ),
);

export const getPageMetaActivities = createSelector(
  [getMetaActivitiesIdList, getMetaActivitiesDict],
  (idList, metaActivities) => idList.map((id) => metaActivities[id]),
);

export const getPageEnabledMetaActivities = createSelector(
  getPageMetaActivities,
  (metactivities) => metactivities.filter((ma) => !!ma.customer_enabled),
);

export const getWorkshops = (state: State): Array<MetaActivity> =>
  state.workshopActivity.all;

export const getWorkshop = (state: State, id: number): MetaActivity =>
  getWorkshops(state).find((ma) => ma.id === id);

export const getEnabledWorkshops = createSelector(
  getWorkshops,
  (workshops) => workshops.filter((ma) => !!ma.customer_enabled),
);
