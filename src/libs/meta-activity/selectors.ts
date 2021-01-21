import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import pickBy from 'lodash/pickBy';
// @ts-ignore
import memoize from 'memoize-one';
import type { MetaActivity } from './types';
import { RootState } from '../../reducers';

export const getMetaActivityAbstractDict = (state: RootState) =>
  state.metaActivity.byId;

export const getMetaActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data, (v) => !v.is_workshop),
);

export const getMetaActivitiesIdList = (state: RootState) =>
  state.metaActivity.allIds;

export const getMetaActivity = (state: RootState, id: number): MetaActivity =>
  state.metaActivity.byId[id];

export const getMetaActivities = createSelector(
  getMetaActivitiesDict,
  (metaActivities) => Immutable<MetaActivity[]>(Object.values(metaActivities)),
);

export const getEnabledMetaActivities = createSelector(
  getMetaActivitiesDict,
  (metactivities) =>
    Immutable(Object.values(metactivities)).filter(
      (ma) => !!ma.customer_enabled,
    ),
);

export const getDisabledMetaActivities = createSelector(
  getMetaActivitiesDict,
  (metactivities) =>
    Immutable(Object.values(metactivities)).filter(
      (ma) => !ma.customer_enabled,
    ),
);

// TODO TYPES THIS
export const getActivitiesByIdList = memoize((state: RootState, idList: any) =>
  createSelector(getMetaActivityAbstractDict, (metactivities) => {
    return Immutable(Object.values(metactivities)).filter((ma) =>
      idList.includes(ma.id),
    );
  })(state),
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

export const getPageDisabledMetaActivities = createSelector(
  getPageMetaActivities,
  (metactivities) => {
    return metactivities.filter((ma) => !ma.customer_enabled);
  },
);

export const getWorkshopActivitiesDict = createSelector(
  getMetaActivityAbstractDict,
  (data) => pickBy(data, (v) => v.is_workshop),
);

export const getWorkshopActivitiesIdList = (state: RootState) =>
  state.metaActivity.allIds;

export const getWorkshops = createSelector(
  getWorkshopActivitiesDict,
  (workshopActivities) =>
    Immutable<MetaActivity[]>(Object.values(workshopActivities)),
);

export const getWorkshop = (state: RootState, id: number): MetaActivity =>
  state.metaActivity.byId[id];

export const getEnabledWorkshops = createSelector(getWorkshops, (workshops) =>
  workshops.filter((ma) => !!ma.customer_enabled),
);

export const getDisabledWorkshops = createSelector(getWorkshops, (workshops) =>
  workshops.filter((ma) => !ma.customer_enabled),
);

export const getFreshMetaActivityList = createSelector(
  getMetaActivitiesDict,
  (m) => Object.keys(m).map((id) => parseInt(id, 10)),
);

export const getFavoriteMetaActivity = (state: RootState) =>
  state.metaActivity.byId[state.metaActivity.favorite.id];
