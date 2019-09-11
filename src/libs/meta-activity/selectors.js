// @flow
import { createSelector } from 'reselect';
import type { State } from '../../state/types';
import type { MetaActivity } from './types';

export const getMetaActivities = (state: State): Array<MetaActivity> =>
  state.metaActivity.all;

export const getMetaActivity = (state: State, id: number): MetaActivity =>
  state.metaActivity.all.find((ma) => ma.id === id);

export const getEnabledMetaActivities = createSelector(
  getMetaActivities,
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
