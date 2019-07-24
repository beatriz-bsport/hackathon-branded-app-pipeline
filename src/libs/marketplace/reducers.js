// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  companyActivitiesActions,
  companyCoachesActions,
  companyEstablishmentsActions,
  companyMetaActivitiesActions,
  companyOffersActions,
  paymentPackList,
  companyDetail,
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
  paymentPack: {
    items: [],
    loading: false,
    error: null,
  },
  company: {
    data: null,
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    // company
    [companyDetail.isLoading]: (state, { payload }) => {
      return state.setIn(['company', 'loading'], payload);
    },
    [companyDetail.error]: (state, { payload }) => {
      return state.setIn(['company', 'error'], payload);
    },
    [companyDetail.success]: (state, { payload }) => {
      return state.setIn(['company', 'data'], payload);
    },
    // payment pack
    [paymentPackList.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentPack', 'loading'], payload);
    },
    [paymentPackList.error]: (state, { payload }) => {
      return state.setIn(['paymentPack', 'error'], payload);
    },
    [paymentPackList.success]: (state, { payload }) => {
      return state.setIn(['paymentPack', 'items'], payload);
    },
    // offers
    [companyOffersActions.isLoading]: (state, { payload }) => {
      return state.setIn(['offers', 'loading'], payload);
    },
    [companyOffersActions.error]: (state, { payload }) => {
      return state.setIn(['offers', 'error'], payload);
    },
    [companyOffersActions.success]: (state, { payload }) => {
      return state.setIn(['offers', 'items'], payload);
    },
    // Coaches
    [companyCoachesActions.isLoading]: (state, { payload }) => {
      return state.setIn(['coaches', 'loading'], payload);
    },
    [companyCoachesActions.error]: (state, { payload }) => {
      return state.setIn(['coaches', 'error'], payload);
    },
    [companyCoachesActions.success]: (state, { payload }) => {
      return state.setIn(['coaches', 'items'], payload);
    },
    // establishments
    [companyEstablishmentsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['establishments', 'loading'], payload);
    },
    [companyEstablishmentsActions.error]: (state, { payload }) => {
      return state.setIn(['establishments', 'error'], payload);
    },
    [companyEstablishmentsActions.success]: (state, { payload }) => {
      return state.setIn(['establishments', 'items'], payload);
    },
    // Activities
    [companyActivitiesActions.isLoading]: (state, { payload }) => {
      return state.setIn(['activities', 'loading'], payload);
    },
    [companyActivitiesActions.error]: (state, { payload }) => {
      return state.setIn(['activities', 'error'], payload);
    },
    [companyActivitiesActions.success]: (state, { payload }) => {
      return state.setIn(['activities', 'items'], payload);
    },
    // MetaActivities
    [companyMetaActivitiesActions.isLoading]: (state, { payload }) => {
      return state.setIn(['metaActivities', 'loading'], payload);
    },
    [companyMetaActivitiesActions.error]: (state, { payload }) => {
      return state.setIn(['metaActivities', 'error'], payload);
    },
    [companyMetaActivitiesActions.success]: (state, { payload }) => {
      return state.setIn(['metaActivities', 'items'], payload);
    },
  },
  initialState,
);
