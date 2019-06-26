// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  companyActivitiesActions,
  companyCoachesActions,
  companyEstablishmentsActions,
  companyMetaActivitiesActions,
  companyOffersActions,
} from './actions';

import type { MarketPlaceState } from './types';

const initialState: MarketPlaceState = Immutable({
  offers: {
    items: [],
    loading: false,
    error: null,
  },
  activities: {
    items: [],
    loading: false,
    error: null,
  },
  metaActivities: {
    items: [],
    loading: false,
    error: null,
  },
  establishments: {
    items: [],
    loading: false,
    error: null,
  },
  coaches: {
    items: [],
    loading: false,
    error: null,
  },
});

const actionsBulk = [
  { action: companyActivitiesActions, id: 'activities' },
  { action: companyMetaActivitiesActions, id: 'metaActivities' },
  { action: companyEstablishmentsActions, id: 'establishments' },
  { action: companyCoachesActions, id: 'coaches' },
  { action: companyOffersActions, id: 'offers' },
];

export default handleActions(
  actionsBulk.map((elem: any) => {
    return {
      [elem.isLoading]: (state, { payload }) => {
        return state.setIn([elem.id, 'loading'], payload);
      },
      [elem.error]: (state, { payload }) => {
        return state.setIn([elem.id, 'error'], payload);
      },
      [elem.success]: (state, { payload }) => {
        return state.setIn([elem.id, 'success'], payload);
      },
    };
  }),
  initialState,
);
