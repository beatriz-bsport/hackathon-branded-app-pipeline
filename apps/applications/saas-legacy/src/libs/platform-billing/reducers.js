// @flow

import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  listPlatformInvoiceActions,
  retrieveSubscriptionActions,
  listUpsellPackagesActions,
  listBillingPlanActions,
  listBillingStageActions,
  listUpsellPackageSubscribedIdsActions,
  retrievePlatformBillingPlanGroupActions,
  retrievePlatformSubscriptionPaymentStatusActions,
  subscribeUpsellPackageActions,
  fetchUpsellPackageActions,
  fetchPlatformCustomerEntityActions,
  listPlatformCustomerEntityRepresentativesActions,
  createPlatformCustomerEntityRepresentativeActions,
  updatePlatformCustomerEntityRepresentativeActions,
} from './actions';

const initialState = Immutable({
  platformSubscription: {
    data: null,
    loading: false,
    error: null,
  },
  platformInvoice: {
    byId: {},
    list: {
      page: null,
      allIds: [],
      nextPage: 1,
    },
  },
  upsellPackage: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
  },
  upsellPackageSubscribed: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
  },
  platformBillingGroup: {
    data: null,
    loading: false,
    error: null,
  },
  platformCustomerEntity: {
    data: null,
    loading: false,
    error: null,
  },
  billingPlan: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
  },
  billingStage: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
  },
  subscriptionPaymentStatus: {
    data: null,
    loading: false,
    error: null,
  },
  platformCustomerEntityRepresentative: {
    list: [],
    loading: false,
    error: null,
  },
});

export default handleActions(
  {
    [retrievePlatformBillingPlanGroupActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['platformBillingGroup', 'loading'], payload);
    },
    [retrievePlatformBillingPlanGroupActions.error]: (state, { payload }) => {
      return state.setIn(['platformBillingGroup', 'error'], payload);
    },
    [retrievePlatformBillingPlanGroupActions.success]: (state, { payload }) => {
      return state.setIn(['platformBillingGroup', 'data'], payload);
    },
    [retrievePlatformSubscriptionPaymentStatusActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(['subscriptionPaymentStatus', 'loading'], payload);
    },
    [retrievePlatformSubscriptionPaymentStatusActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(['subscriptionPaymentStatus', 'error'], payload);
    },
    [retrievePlatformSubscriptionPaymentStatusActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(['subscriptionPaymentStatus', 'data'], payload);
    },
    [retrieveSubscriptionActions.isLoading]: (state, { payload }) => {
      return state.setIn(['platformSubscription', 'loading'], payload);
    },
    [retrieveSubscriptionActions.error]: (state, { payload }) => {
      return state.setIn(['platformSubscription', 'error'], payload);
    },
    [retrieveSubscriptionActions.success]: (state, { payload }) => {
      return state.setIn(['platformSubscription', 'data'], payload);
    },
    [listPlatformInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['platformInvoice', 'loading'], payload);
    },
    [listPlatformInvoiceActions.error]: (state, { payload }) => {
      return state.set(['platformInvoice', 'error'], payload);
    },
    [listPlatformInvoiceActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            platformInvoice: {
              byId: payload.results.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['platformInvoice', 'list', 'allIds'],
          [
            ...state.platformInvoice.list.allIds,
            ...payload.results
              .filter(
                (inv) => !state.platformInvoice.list.allIds.includes(inv.id),
              )
              .map((inv) => inv.id),
          ],
        )
        .setIn(['platformInvoice', 'list', 'page'], payload.page)
        .setIn(['platformInvoice', 'list', 'nextPage'], payload.next_page);
    },
    [listUpsellPackagesActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsellPackage', 'loading'], payload);
    },
    [listUpsellPackagesActions.error]: (state, { payload }) => {
      return state.set(['upsellPackage', 'error'], payload);
    },
    [listUpsellPackagesActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            upsellPackage: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['upsellPackage', 'allIds'],
          payload.map((up) => up.id),
        );
    },
    [fetchUpsellPackageActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsellPackage', 'loading'], payload);
    },
    [fetchUpsellPackageActions.error]: (state, { payload }) => {
      return state.set(['upsellPackage', 'error'], payload);
    },
    [fetchUpsellPackageActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            upsellPackage: {
              byId: payload.reduce((acc, up) => {
                acc[up.id] = up;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['upsellPackage', 'allIds'],
          [
            ...state.upsellPackage.allIds.filter((id) => id !== payload.id),
            ...payload.map((up) => up.id),
          ],
        );
    },
    [listUpsellPackageSubscribedIdsActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsellPackageSubscribed', 'loading'], payload);
    },
    [listUpsellPackageSubscribedIdsActions.error]: (state, { payload }) => {
      return state.set(['upsellPackageSubscribed', 'error'], payload);
    },
    [listUpsellPackageSubscribedIdsActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            upsellPackageSubscribed: {
              byId: payload.reduce((acc, ups) => {
                acc[ups.id] = ups;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['upsellPackageSubscribed', 'allIds'],
          payload.map((ups) => ups.id),
        );
    },
    [listBillingPlanActions.isLoading]: (state, { payload }) => {
      return state.setIn(['billingPlan', 'loading'], payload);
    },
    [listBillingPlanActions.error]: (state, { payload }) => {
      return state.set(['billingPlan', 'error'], payload);
    },
    [listBillingPlanActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            billingPlan: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['billingPlan', 'allIds'],
          payload.map((up) => up.id),
        );
    },
    [listBillingStageActions.isLoading]: (state, { payload }) => {
      return state.setIn(['billingStage', 'loading'], payload);
    },
    [listBillingStageActions.error]: (state, { payload }) => {
      return state.set(['billingStage', 'error'], payload);
    },
    [listBillingStageActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            billingStage: {
              byId: payload.reduce((acc, ps) => {
                acc[ps.id] = ps;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        )
        .setIn(
          ['billingStage', 'allIds'],
          payload.map((ups) => ups.id),
        );
    },
    [fetchPlatformCustomerEntityActions.isLoading]: (state, { payload }) => {
      return state.setIn(['platformCustomerEntity', 'loading'], payload);
    },
    [fetchPlatformCustomerEntityActions.error]: (state, { payload }) => {
      return state.set(['platformCustomerEntity', 'error'], payload);
    },
    [fetchPlatformCustomerEntityActions.success]: (state, { payload }) => {
      return state.setIn(['platformCustomerEntity', 'data'], payload);
    },
    [subscribeUpsellPackageActions.isLoading]: (state, { payload }) => {
      return state.setIn(['upsellPackage', 'loading'], payload);
    },
    [subscribeUpsellPackageActions.error]: (state, { payload }) => {
      return state.set(['upsellPackage', 'error'], payload);
    },
    [subscribeUpsellPackageActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            upsellPackage: {
              byId: {
                ...state.upsellPackage.byId,
                [payload.upsell_package.id]: {
                  ...payload.upsell_package,
                },
              },
            },
            upsellPackageSubscribed: {
              byId: {
                ...state.upsellPackageSubscribed.byId,
                [payload.upsell_package_subscribed.id]:
                  payload.upsell_package_subscribed,
              },
            },
          },
          { deep: true },
        )
        .setIn(
          ['upsellPackageSubscribed', 'allIds'],
          [
            ...state.upsellPackageSubscribed.allIds,
            payload.upsell_package_subscribed.id,
          ],
        );
    },
    [listPlatformCustomerEntityRepresentativesActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'loading'],
        payload,
      );
    },
    [listPlatformCustomerEntityRepresentativesActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'error'],
        payload,
      );
    },
    [listPlatformCustomerEntityRepresentativesActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'list'],
        payload,
      );
    },
    [createPlatformCustomerEntityRepresentativeActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'loading'],
        payload,
      );
    },
    [createPlatformCustomerEntityRepresentativeActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'error'],
        payload,
      );
    },
    [createPlatformCustomerEntityRepresentativeActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'list'],
        [...state.platformCustomerEntityRepresentative.list, payload],
      );
    },
    [updatePlatformCustomerEntityRepresentativeActions.isLoading]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'loading'],
        payload,
      );
    },
    [updatePlatformCustomerEntityRepresentativeActions.error]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'error'],
        payload,
      );
    },
    [updatePlatformCustomerEntityRepresentativeActions.success]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['platformCustomerEntityRepresentative', 'list'],
        state.platformCustomerEntityRepresentative.list.map((rep) =>
          rep.id === payload.id ? payload : rep,
        ),
      );
    },
  },
  initialState,
);
