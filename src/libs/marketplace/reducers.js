// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  fetchCompanyActivities,
  fetchCompanyCoaches,
  fetchCompanyEstablishments,
  fetchCompanyMetaActivities,
  fetchCompanyOffers,
} from './actions';

const initialState: MarketPalceState = {
  offres: {
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
};
export default handleActions();
