// @flow

import type { State } from '../../state/types';
import type { MetaActivity } from './types';

export const getMetaActivities = (state: State): Array<MetaActivity> =>
  state.metaActivity.all;

export const getEnabledMetaActivities = (state: State): Array<MetaActivity> =>
  getMetaActivities(state).filter((ma) => !!ma.customer_enabled);

export const getWorkshops = (state: State): Array<MetaActivity> =>
  state.workshopActivity.all;

export const getEnabledWorkshops = (state: State): Array<MetaActivity> =>
  getWorkshops(state).filter((ma) => !!ma.customer_enabled);
