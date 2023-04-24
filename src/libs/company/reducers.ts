// @ts-nocheck
// @flow

import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  searchActions,
  listFeatureActions,
  retrieveMyCompanyActions,
  stripeCompanyRetrieveActions,
  validateAccountConfigurationStepActions,
  retrieveStripeAccountStatusActions,
} from './actions';
import { CompanyState, Company } from './types';
import {
  BANK_ACCOUNT_CONFIGURATION_STEP,
  PAYMENT_METHOD_CONFIGURATION_STEP,
  STRIPE_CONFIGURATION_STEP,
} from './constants';

const initialState: Immutable.Immutable<CompanyState> = Immutable({
  byId: {},
  feature: {
    data: {
      upsell: [],
    },
    loading: false,
    error: null,
  },
  search: {
    loading: false,
    error: null,
    allIds: [],
  },
  setup: null,
  setupLoading: false,
  stripeCompany: {
    loading: false,
    error: null,
    data: null,
  },
  stripeAccountStatus: {
    data: null,
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [searchActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'loading'], payload);
    },
    [searchActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['search', 'error'], payload);
    },
    [searchActions.success.toString()]: (state, { payload }) => {
      const newIds = payload.map((m: Company) => m.id);
      return state
        .set(
          'byId',
          payload.reduce(
            (acc: { [id: number]: Company }, v: Company) => ({
              ...acc,
              [v.id]: v,
            }),
            {},
          ),
        )
        .setIn(['search', 'allIds'], newIds);
    },
    [listFeatureActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['feature', 'data'], payload || []);
    },
    [listFeatureActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['feature', 'loading'], payload);
    },
    [listFeatureActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['feature', 'error'], payload);
    },
    [validateAccountConfigurationStepActions.success.toString()]: (
      state,
      { payload },
    ) => {
      let propertyModified = null;
      switch (payload) {
        case STRIPE_CONFIGURATION_STEP:
          propertyModified = 'has_completed_stripe_configuration';
          break;
        case BANK_ACCOUNT_CONFIGURATION_STEP:
          propertyModified = 'has_completed_bank_account_configuration';
          break;
        case PAYMENT_METHOD_CONFIGURATION_STEP:
          propertyModified = 'has_completed_payment_method_configuration';
          break;
        default:
          propertyModified = 'has_completed_account_configuration_on_boarding';
          break;
      }
      return state.setIn(['stripeCompany', 'data', propertyModified], true);
    },
    [validateAccountConfigurationStepActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['stripeCompany', 'loading'], payload);
    },
    [validateAccountConfigurationStepActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['stripeCompany', 'error'], payload);
    },
    [retrieveMyCompanyActions.success.toString()]: (state, { payload }) => {
      return state.set('setup', payload);
    },
    [retrieveMyCompanyActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('setupLoading', payload);
    },
    [stripeCompanyRetrieveActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['stripeCompany', 'data'], payload);
    },
    [stripeCompanyRetrieveActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['stripeCompany', 'loading'], payload);
    },
    [stripeCompanyRetrieveActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['stripeCompany', 'error'], payload);
    },
    [retrieveStripeAccountStatusActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['stripeAccountStatus', 'loading'], payload);
    },
    [retrieveStripeAccountStatusActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['stripeAccountStatus', 'error'], payload);
    },
    [retrieveStripeAccountStatusActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['stripeAccountStatus', 'data'], payload);
    },
  },
  initialState,
);
