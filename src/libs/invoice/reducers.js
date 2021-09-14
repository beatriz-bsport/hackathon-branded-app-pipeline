import Immutable from 'seamless-immutable';

import { handleActions } from 'redux-actions';

import {
  returnPaymentActions,
  invoiceConfigurationDetailActions,
  invoiceConfigurationPatchActions,
  finalizeInvoiceActions,
  quickInvoiceActions,
  retrieveInvoiceActions,
  updatePaymentMethodActions,
  createOrUpdateInvoiceActions,
  listPaymentActions,
  listInvoiceItemActions,
  listInvoiceActions,
  listPlannedPaymentEventActions,
  editCustomFooterActions,
  checkInvoiceInfoActions,
  cancelPlannedPaymentEventActions,
  enablePlannedPaymentEventActions,
  registerNowPlannedPaymentEventActions,
  schedulePaymentActions,
} from './actions';

const initialState = Immutable({
  byId: {},

  list: {
    count: 0,
    loading: false,
    page: 1,
    error: null,
    allIds: [],
  },

  loading: true,
  loadingSpecific: false,
  errorSpecific: false,
  invoice: null,
  error: null,
  createOrUpdate: {
    loading: false,
    error: null,
  },
  payment: {
    byId: {},
    loading: false,
    error: null,
    allIds: [],
  },
  invoiceItem: {
    byId: {},
    loading: false,
    error: null,
  },
  planned_payment_event: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
  },

  returnPayment: {
    loading: false,
    error: null,
  },

  configuration: {
    result: null,
    loading: false,
    error: null,
    updating: false,
  },
  finalize: {
    loading: false,
    error: null,
  },

  invoiceInfo: {
    loading: false,
    error: null,
    data: null,
  },

  quickInvoices: [],
  quickInvoiceLoading: false,
});

export default handleActions(
  {
    [checkInvoiceInfoActions.isLoading]: (state, { payload }) => {
      return state.setIn(['invoiceInfo', 'loading'], payload);
    },
    [checkInvoiceInfoActions.error]: (state, { payload }) => {
      return state.setIn(['invoiceInfo', 'error'], payload);
    },
    [checkInvoiceInfoActions.success]: (state, { payload }) => {
      return state.setIn(['invoiceInfo', 'data'], payload);
    },
    [checkInvoiceInfoActions.reset]: (state) => {
      return state.setIn(['invoiceInfo', 'data'], null);
    },
    [listInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['list', 'loading'], payload);
    },
    [listInvoiceActions.error]: (state, { payload }) => {
      return state.setIn(['list', 'error'], payload);
    },
    [listInvoiceActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            byId: (payload.results || payload).reduce(
              (acc, v) => ({ ...acc, [v.uuid]: v }),
              {},
            ),
          },
          { deep: true },
        )
        .setIn(
          ['list', 'allIds'],
          (payload.results || payload).map((inv) => inv.uuid),
        )
        .setIn(['list', 'count'], payload.count)
        .setIn(['list', 'page'], payload.page);
    },
    [listPaymentActions.isLoading]: (state, { payload }) => {
      return state.setIn(['payment', 'loading'], payload);
    },
    [listPaymentActions.error]: (state, { payload }) => {
      return state.setIn(['payment', 'error'], payload);
    },
    [listPaymentActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['payment', 'allIds'],
          payload.map((p) => p.id),
        )
        .merge(
          {
            payment: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [listInvoiceItemActions.isLoading]: (state, { payload }) => {
      return state.setIn(['invoiceItem', 'loading'], payload);
    },
    [listInvoiceItemActions.error]: (state, { payload }) => {
      return state.setIn(['invoiceItem', 'error'], payload);
    },
    [listInvoiceItemActions.success]: (state, { payload }) => {
      return state.merge(
        {
          invoiceItem: {
            byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
          },
        },
        { deep: true },
      );
    },
    [returnPaymentActions.isLoading]: (state, { payload }) => {
      return state.setIn(['returnPayment', 'loading'], payload);
    },
    [returnPaymentActions.error]: (state, { payload }) => {
      return state.setIn(['returnPayment', 'error'], payload);
    },
    [invoiceConfigurationDetailActions.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [invoiceConfigurationDetailActions.error]: (state, { payload }) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [invoiceConfigurationDetailActions.success]: (state, { payload }) => {
      return state.setIn(['configuration', 'result'], payload);
    },
    [invoiceConfigurationPatchActions.isLoading]: (state, { payload }) => {
      return state.setIn(['configuration', 'updating'], payload);
    },

    [finalizeInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['finalize', 'loading'], payload);
    },
    [finalizeInvoiceActions.error]: (state, { payload }) => {
      return state.setIn(['finalize', 'error'], payload);
    },
    [finalizeInvoiceActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [quickInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['quickInvoice', 'loading'], payload);
    },
    [quickInvoiceActions.error]: (state, { payload }) => {
      return state.setIn(['quickInvoice', 'error'], payload);
    },

    [quickInvoiceActions.success]: (state, { payload }) => {
      return state.setIn(
        ['quickInvoices', state.quickInvoices.length],
        payload,
      );
    },

    [quickInvoiceActions.reset]: (state, { payload }) => {
      if (payload) {
        return state.setIn(['quickInvoice', 'loading'], false).set(
          'quickInvoices',
          state.quickInvoices.filter((qi) => qi.uuid !== payload),
        );
      }
      return state
        .setIn(['quickInvoice', 'loading'], false)
        .set('quickInvoices', []);
    },

    [retrieveInvoiceActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [retrieveInvoiceActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [retrieveInvoiceActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [updatePaymentMethodActions.isLoading]: (state, { payload }) => {
      return state.setIn(['updatePaymentMethod', 'loading'], payload);
    },
    [updatePaymentMethodActions.error]: (state, { payload }) => {
      return state.setIn(['updatePaymentMethod', 'error'], payload);
    },
    [updatePaymentMethodActions.success]: (state, { payload }) => {
      return state.setIn(['payment', 'byId', payload.id], payload);
    },
    [createOrUpdateInvoiceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'loading'], payload);
    },
    [createOrUpdateInvoiceActions.error]: (state, { payload }) => {
      return state.setIn(['createOrUpdate', 'error'], payload);
    },
    [createOrUpdateInvoiceActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [editCustomFooterActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.uuid], payload);
    },
    [listPlannedPaymentEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [cancelPlannedPaymentEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [enablePlannedPaymentEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [enablePlannedPaymentEventActions.error]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [enablePlannedPaymentEventActions.success]: (state, { payload }) => {
      return state.setIn(
        ['planned_payment_event', 'byId', payload.uuid],
        payload,
      );
    },
    [registerNowPlannedPaymentEventActions.isLoading]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [registerNowPlannedPaymentEventActions.error]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [registerNowPlannedPaymentEventActions.success]: (state, { payload }) => {
      return state.setIn(
        ['planned_payment_event', 'byId', payload.uuid],
        payload,
      );
    },
    [cancelPlannedPaymentEventActions.success]: (state, { payload }) => {
      return state.setIn(
        ['planned_payment_event', 'byId', payload.uuid],
        payload,
      );
    },
    [listPlannedPaymentEventActions.error]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [listPlannedPaymentEventActions.success]: (state, { payload }) => {
      return state
        .merge(
          {
            planned_payment_event: {
              byId: (payload.results || payload).reduce(
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        )
        .setIn(
          ['planned_payment_event', 'allIds'],
          (payload.results || payload).map((inv) => inv.id),
        )
        .setIn(['planned_payment_event', 'count'], payload.count)
        .setIn(['planned_payment_event', 'page'], payload.page);
    },
    [schedulePaymentActions.loading]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'loading'], payload);
    },
    [schedulePaymentActions.error]: (state, { payload }) => {
      return state.setIn(['planned_payment_event', 'error'], payload);
    },
    [schedulePaymentActions.success]: (state, { payload }) => {
      return state.merge(
        {
          planned_payment_event: {
            byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
          },
        },
        { deep: true },
      );
    },
  },
  initialState,
);
