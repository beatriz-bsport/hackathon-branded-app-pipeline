// @flow
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import pickBy from 'lodash/pickBy';
import memoize from 'memoize-one';
import type { State } from '../../state/types';
import type { MetaActivity } from './types';

export const getMetaActivityAbstractDict = (
  state: State,
): Array<MetaActivity> => state.metaActivity.byId;

export const getMetaActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data, (v) => !v.is_workshop),
);

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

export const getActivitiesByIdList = memoize((state, idList) =>
  createSelector(
    getMetaActivitiesDict,
    (metactivities) =>
      Immutable(Object.values(metactivities)).filter((ma) =>
        idList.includes(ma.id),
      ),
  )(state),
);

export const getPageMetaActivities = createSelector(
  [getMetaActivitiesIdList, getMetaActivitiesDict],
  (idList, metaActivities) =>
    idList.map((id) => metaActivities[id]).filter((ma) => !!ma),
);

export const getPageEnabledMetaActivities = createSelector(
  getPageMetaActivities,
  (metactivities) => {
    return metactivities.filter((ma) => !!ma.customer_enabled);
  },
);

// WORKSHOP
// --------

export const getWorkshopActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data, (v) => v.is_workshop),
);

export const getWorkshopActivitiesIdList = (
  state: State,
): Array<MetaActivity> => state.metaActivity.allIds;

export const getWorkshops = createSelector(
  getWorkshopActivitiesDict,
  (workshopActivities) => Immutable(Object.values(workshopActivities)),
);

export const getWorkshop = (state: State, id: number): MetaActivity =>
  state.metaActivity.byId[id];

export const getEnabledWorkshops = createSelector(
  getWorkshops,
  (workshops) => workshops.filter((ma) => !!ma.customer_enabled),
);

export const getFreshMetaActivityList = createSelector(
  getMetaActivitiesDict,
  (m) => Object.keys(m).map((id) => parseInt(id, 10)),
);

export const getFavoriteMetaActivity = (state) =>
  state.metaActivity.byId[state.metaActivity.favorite.id];
