import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';
import {
  searchActions,
  listFeatureActions,
  retrieveMyCompanyActions,
  stripeCompanyRetrieveActions,
  validateAccountConfigurationStepActions,
  retrieveStripeAccountStatusActions,
  retrievePayPalAccountStatusActions,
  fetchPayPalOnboardingLinkActions,
} from './actions';
import type {
  AccountConfigurationStep,
  Company,
  CompanySetup,
  CompanyState,
  FeatureList,
  PayPalCompanyStatus,
  StripeAccountStatus,
  StripeCompany,
} from './types';
import {
  BANK_ACCOUNT_CONFIGURATION_STEP,
  PAYMENT_METHOD_CONFIGURATION_STEP,
  STRIPE_CONFIGURATION_STEP,
  INVOICE_NUMBERING_CONFIGURATION_STEP,
} from './constants';

const initialState: Immutable.Immutable<CompanyState> = Immutable<CompanyState>(
  {
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
    paypalCompanyStatus: {
      loading: false,
      error: null,
      data: null,
    },
    paypalOnboardingLink: {
      loading: false,
      redirecting: false,
      error: null,
      data: null,
    },
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
  },
);

export default handleActions<Immutable.Immutable<CompanyState>, any>(
  {
    [searchActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['search', 'loading'], payload);
    },
    [searchActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['search', 'error'], payload);
    },
    [searchActions.success.toString()]: (
      state,
      { payload }: { payload: Company[] },
    ) => {
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
    [listFeatureActions.success.toString()]: (
      state,
      { payload }: { payload: FeatureList },
    ) => {
      return state.setIn(['feature', 'data'], payload ?? []);
    },
    [listFeatureActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['feature', 'loading'], payload);
    },
    [listFeatureActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['feature', 'error'], payload);
    },
    [validateAccountConfigurationStepActions.success.toString()]: (
      state,
      { payload }: { payload: AccountConfigurationStep },
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
        case INVOICE_NUMBERING_CONFIGURATION_STEP:
          propertyModified =
            'has_completed_invoice_sequential_number_configuration';
          break;
        default:
          propertyModified = 'has_completed_account_configuration_on_boarding';
          break;
      }
      return state.setIn(['stripeCompany', 'data', propertyModified], true);
    },
    [validateAccountConfigurationStepActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['stripeCompany', 'loading'], payload);
    },
    [validateAccountConfigurationStepActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['stripeCompany', 'error'], payload);
    },
    [retrieveMyCompanyActions.success.toString()]: (
      state,
      { payload }: { payload: CompanySetup },
    ) => {
      return state.set('setup', payload);
    },
    [retrieveMyCompanyActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('setupLoading', payload);
    },
    [stripeCompanyRetrieveActions.success.toString()]: (
      state,
      { payload }: { payload: StripeCompany },
    ) => {
      return state.setIn(['stripeCompany', 'data'], payload);
    },
    [stripeCompanyRetrieveActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['stripeCompany', 'loading'], payload);
    },
    [stripeCompanyRetrieveActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['stripeCompany', 'error'], payload);
    },
    [retrieveStripeAccountStatusActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['stripeAccountStatus', 'loading'], payload);
    },
    [retrieveStripeAccountStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['stripeAccountStatus', 'error'], payload);
    },
    [retrieveStripeAccountStatusActions.success.toString()]: (
      state,
      { payload }: { payload: StripeAccountStatus },
    ) => {
      return state.setIn(['stripeAccountStatus', 'data'], payload);
    },
    [retrievePayPalAccountStatusActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['paypalCompanyStatus', 'loading'], payload);
    },
    [retrievePayPalAccountStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['paypalCompanyStatus', 'error'], payload);
    },
    [retrievePayPalAccountStatusActions.success.toString()]: (
      state,
      { payload }: { payload: PayPalCompanyStatus },
    ) => {
      return state.setIn(['paypalCompanyStatus', 'data'], payload);
    },
    [fetchPayPalOnboardingLinkActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['paypalOnboardingLink', 'loading'], payload);
    },
    [fetchPayPalOnboardingLinkActions.isRedirecting.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['paypalOnboardingLink', 'redirecting'], payload);
    },
    [fetchPayPalOnboardingLinkActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['paypalOnboardingLink', 'error'], payload);
    },
    [fetchPayPalOnboardingLinkActions.success.toString()]: (
      state,
      { payload }: { payload: { onboarding_url: string } },
    ) => {
      return state.setIn(
        ['paypalOnboardingLink', 'data'],
        payload.onboarding_url,
      );
    },
  },
  initialState,
);
