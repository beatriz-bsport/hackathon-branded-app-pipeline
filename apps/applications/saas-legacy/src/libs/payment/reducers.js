// @flow

import { handleActions } from 'redux-actions';
import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';

import {
  checkStripeDomainActions,
  createBookkeepingAccountActions,
  createPaymentAttemptActions,
  deleteBookkeepingAccountActions,
  detachPaymentMethodActions,
  fetchPaymentGroupStatusActions,
  getLinkedProductNamesActions,
  incrementalListPayoutActions,
  listBookkeepingAccountActions,
  listPaymentGroupActions,
  listSavedPaymentMethodListActions,
  listStripeDomainActions,
  listPayoutActions,
  listPayoutBalanceTransactionsActions,
  listPayoutLegacyActions,
  listStripePayoutActions,
  onSpotPaymentReportActions,
  registerStripeDomainActions,
  stripeBalanceActions,
  submitInternalPaymentInBackgroundActions,
  updateBookkeepingAccountActions,
} from './actions';

const initialState = Immutable({
  paymentMethod: {
    loading: false,
    error: null,
    items: [],
  },
  onSpotPaymentReport: {
    id: null,
    error: null,
    loading: false,
  },
  paymentGroup: {
    error: null,
    loading: false,
    allIds: [],
    byId: {},
  },
  paymentAttempt: {
    error: null,
    loading: false,
    id: null,
    amount: null,
  },
  paymentGroupStatus: {
    error: null,
    loading: false,
    status: null,
  },
  payoutLegacy: {
    error: null,
    loading: false,
    allIds: [],
    byId: {},
    nextPage: 1,
  },
  stripePayout: {
    error: null,
    loading: false,
    allIds: [],
    byId: {},
    startingAfter: null,
    hasMore: true,
  },
  payout: {
    error: null,
    loading: false,
    loadingMore: false,
    results: [],
    nextPage: null,
  },
  payoutBalanceTransactions: {
    byPayoutId: {},
  },
  incrementalPayout: {
    error: null,
    loading: false,
    allIds: [],
    byId: {},
    nextPage: 1,
  },
  detachPaymentMethod: {
    loading: false,
    error: null,
    msg: {},
  },
  balance: {
    isLoading: false,
    error: null,
    amountAvailable: 0,
    amountPending: 0,
  },
  paymentGroupBeingProcessed: {
    byInvoiceUuid: {},
  },
  bookkeepingAccounts: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    linkedProductNames: [],
  },
  stripeDomainList: {
    loading: false,
    error: null,
    items: [],
    registerError: null,
  },
  stripeDomainCheck: {
    loading: false,
    error: null,
    isRegistered: null,
  },
});

export default handleActions(
  {
    [listPayoutLegacyActions.success.toString()]: (state, { payload }) => {
      const newIds = payload.results.map((po) => po.id);
      return state
        .setIn(
          ['payoutLegacy', 'allIds'],
          payload.page === 1
            ? newIds
            : [...state.payoutLegacy.allIds, ...newIds],
        )
        .setIn(['payoutLegacy', 'nextPage'], payload.next_page)
        .merge(
          {
            payoutLegacy: {
              byId: payload.results.reduce((acc, v) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [listPayoutLegacyActions.isLoading]: (state, { payload }) => {
      return state.setIn(['payoutLegacy', 'loading'], payload);
    },
    [listPayoutLegacyActions.error]: (state, { payload }) => {
      return state.setIn(['payoutLegacy', 'error'], payload);
    },
    [incrementalListPayoutActions.success.toString()]: (state, { payload }) => {
      const newIds = payload.results.map((po) => po.id);
      return state
        .setIn(
          ['incrementalPayout', 'allIds'],

          Array.from(new Set([...state.incrementalPayout.allIds, ...newIds])),
        )
        .setIn(['incrementalPayout', 'nextPage'], payload.next_page)
        .merge(
          {
            incrementalPayout: {
              byId: payload.results.reduce((acc, v) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [incrementalListPayoutActions.reset]: (state) => {
      return state
        .setIn(['incrementalPayout', 'allIds'], [])
        .setIn(['incrementalPayout', 'nextPage'], 1);
    },
    [incrementalListPayoutActions.isLoading]: (state, { payload }) => {
      return state.setIn(['incrementalPayout', 'loading'], payload);
    },
    [incrementalListPayoutActions.error]: (state, { payload }) => {
      return state.setIn(['incrementalPayout', 'error'], payload);
    },

    [listSavedPaymentMethodListActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentMethod', 'items'], payload);
    },
    [listSavedPaymentMethodListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'loading'], payload);
    },
    [listSavedPaymentMethodListActions.error]: (state, { payload }) => {
      return state.setIn(['paymentMethod', 'error'], payload);
    },
    [detachPaymentMethodActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['detachPaymentMethod', 'msg'], payload);
    },
    [detachPaymentMethodActions.isLoading]: (state, { payload }) => {
      return state.setIn(['detachPaymentMethod', 'loading'], payload);
    },
    [detachPaymentMethodActions.error]: (state, { payload }) => {
      return state.setIn(['detachPaymentMethod', 'error'], payload);
    },
    [onSpotPaymentReportActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['onSpotPaymentReport', 'id'], payload[0].id);
    },
    [onSpotPaymentReportActions.isLoading]: (state, { payload }) => {
      return state.setIn(['onSpotPaymentReport', 'loading'], payload);
    },
    [onSpotPaymentReportActions.error]: (state, { payload }) => {
      return state.setIn(['onSpotPaymentReport', 'error'], payload);
    },
    [createPaymentAttemptActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['paymentAttempt', 'id'], payload.payment_attempt_id)
        .setIn(['paymentAttempt', 'amount'], payload.payment_attempt_amount);
    },
    [createPaymentAttemptActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentAttempt', 'loading'], payload);
    },
    [createPaymentAttemptActions.error]: (state, { payload }) => {
      return state.setIn(['paymentAttempt', 'error'], payload);
    },
    [fetchPaymentGroupStatusActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentGroupStatus', 'status'], payload);
    },
    [fetchPaymentGroupStatusActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentGroupStatus', 'loading'], payload);
    },
    [fetchPaymentGroupStatusActions.error]: (state, { payload }) => {
      return state.setIn(['paymentGroupStatus', 'error'], payload);
    },
    [listPaymentGroupActions.error]: (state, { payload }) => {
      return state.setIn(['paymentGroup', 'error'], payload);
    },
    [listPaymentGroupActions.isLoading]: (state, { payload }) => {
      return state.setIn(['paymentGroup', 'loading'], payload);
    },
    [listPaymentGroupActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(
          ['paymentGroup', 'allIds'],
          payload.map((pg) => pg.id),
        )
        .merge(
          {
            paymentGroup: {
              byId: payload.reduce((acc, v) => {
                acc[v.id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [stripeBalanceActions.success.toString()]: (state, { payload }) => {
      return state
        .setIn(['balance', 'amountAvailable'], payload.balance_available)
        .setIn(['balance', 'amountPending'], payload.balance_pending);
    },
    [stripeBalanceActions.isLoading]: (state, { payload }) => {
      return state.setIn(['balance', 'isLoading'], payload);
    },
    [stripeBalanceActions.error]: (state, { payload }) => {
      return state.setIn(['balance', 'error'], payload);
    },

    [submitInternalPaymentInBackgroundActions.loading.toString()]: (
      state,
      { payload }: { invoiceUuid: string, loading: boolean },
    ) => {
      return state.setIn(
        [
          'paymentGroupBeingProcessed',
          'byInvoiceUuid',
          payload.invoiceUuid,
          'loading',
        ],
        payload.loading,
      );
    },
    [submitInternalPaymentInBackgroundActions.error.toString()]: (
      state,
      { payload }: { invoiceUuid: string, error: Error },
    ) => {
      return state.setIn(
        [
          'paymentGroupBeingProcessed',
          'byInvoiceUuid',
          payload.invoiceUuid,
          'error',
        ],
        payload.error,
      );
    },
    [listStripePayoutActions.success.toString()]: (state, { payload }) => {
      const newIds = payload.results.map((po) => po.stripe_id);
      return state
        .setIn(
          ['stripePayout', 'allIds'],
          uniq([...state.stripePayout.allIds, ...newIds]),
        )
        .setIn(
          ['stripePayout', 'startingAfter'],
          payload.next_page.starting_after,
        )
        .setIn(['stripePayout', 'hasMore'], payload.has_more)
        .merge(
          {
            stripePayout: {
              byId: payload.results.reduce((acc, v) => {
                acc[v.stripe_id] = v;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [listStripePayoutActions.isLoading]: (state, { payload }) => {
      return state.setIn(['stripePayout', 'loading'], payload);
    },
    [listStripePayoutActions.error]: (state, { payload }) => {
      return state.setIn(['stripePayout', 'error'], payload);
    },
    [listPayoutActions.isLoading]: (state, { payload }) => {
      return state.setIn(['payout', 'loading'], payload);
    },
    [listPayoutActions.isLoadingMore]: (state, { payload }) => {
      return state.setIn(['payout', 'loadingMore'], payload);
    },
    [listPayoutActions.error]: (state, { payload }) => {
      return state.setIn(['payout', 'error'], payload);
    },
    [listPayoutActions.success.toString()]: (state, { payload }) => {
      const { results, nextPage, append } = payload;
      return state
        .setIn(
          ['payout', 'results'],
          append ? [...(state.payout.results || []), ...results] : results,
        )
        .setIn(['payout', 'nextPage'], nextPage);
    },
    [listPayoutBalanceTransactionsActions.isLoading]: (state, { payload }) => {
      const { payoutId, loading } = payload;
      const current =
        state.payoutBalanceTransactions?.byPayoutId?.[payoutId] || {};
      return state.setIn(
        ['payoutBalanceTransactions', 'byPayoutId', payoutId],
        { ...current, loading },
      );
    },
    [listPayoutBalanceTransactionsActions.isLoadingMore]: (
      state,
      { payload },
    ) => {
      const { payoutId, loading } = payload;
      const current =
        state.payoutBalanceTransactions?.byPayoutId?.[payoutId] || {};
      return state.setIn(
        ['payoutBalanceTransactions', 'byPayoutId', payoutId],
        { ...current, loadingMore: loading },
      );
    },
    [listPayoutBalanceTransactionsActions.error]: (state, { payload }) => {
      const { payoutId, error } = payload;
      const current =
        state.payoutBalanceTransactions?.byPayoutId?.[payoutId] || {};
      return state.setIn(
        ['payoutBalanceTransactions', 'byPayoutId', payoutId],
        { ...current, error },
      );
    },
    [listPayoutBalanceTransactionsActions.success.toString()]: (
      state,
      { payload },
    ) => {
      const { payoutId, results, nextPage, append } = payload;
      const current =
        state.payoutBalanceTransactions?.byPayoutId?.[payoutId] || {};
      const newResults = append
        ? [...(current.results || []), ...results]
        : results;
      return state.setIn(
        ['payoutBalanceTransactions', 'byPayoutId', payoutId],
        {
          ...current,
          results: newResults,
          nextPage,
        },
      );
    },
    [listBookkeepingAccountActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['bookkeepingAccounts', 'allIds'],
          payload.map((bookkeepingAccount) => bookkeepingAccount.id),
        )
        .merge(
          {
            bookkeepingAccounts: {
              byId: payload.reduce((accumulator, bookkeepingAccount) => {
                accumulator[bookkeepingAccount.id] = bookkeepingAccount;
                return accumulator;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [listBookkeepingAccountActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'loading'], payload);
    },
    [listBookkeepingAccountActions.error]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'error'], payload);
    },
    [createBookkeepingAccountActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'loading'], payload);
    },
    [createBookkeepingAccountActions.error]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'error'], payload);
    },
    [updateBookkeepingAccountActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'loading'], payload);
    },
    [updateBookkeepingAccountActions.error]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'error'], payload);
    },
    [deleteBookkeepingAccountActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'loading'], payload);
    },
    [deleteBookkeepingAccountActions.error]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'error'], payload);
    },
    [getLinkedProductNamesActions.success.toString()]: (state, { payload }) => {
      return state.setIn(
        ['bookkeepingAccounts', 'linkedProductNames'],
        payload,
      );
    },
    [getLinkedProductNamesActions.isLoading]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'loading'], payload);
    },
    [getLinkedProductNamesActions.error]: (state, { payload }) => {
      return state.setIn(['bookkeepingAccounts', 'error'], payload);
    },
    [listStripeDomainActions.isLoading]: (state, { payload }) => {
      return state.setIn(['stripeDomainList', 'loading'], payload);
    },
    [listStripeDomainActions.error]: (state, { payload }) => {
      return state.setIn(['stripeDomainList', 'error'], payload);
    },
    [listStripeDomainActions.success]: (state, { payload }) => {
      return state.setIn(['stripeDomainList', 'items'], payload.results);
    },

    [registerStripeDomainActions.isLoading]: (state, { payload }) => {
      return payload
        ? state
            .setIn(['stripeDomainList', 'loading'], payload)
            .setIn(['stripeDomainList', 'registerError'], null)
        : state.setIn(['stripeDomainList', 'loading'], payload);
    },
    [registerStripeDomainActions.error]: (state, { payload }) => {
      return state.setIn(['stripeDomainList', 'registerError'], payload);
    },
    [registerStripeDomainActions.success]: (state, { payload }) => {
      return state
        .setIn(
          ['stripeDomainList', 'items'],
          [...state.stripeDomainList.items, payload],
        )
        .setIn(['stripeDomainList', 'registerError'], null);
    },

    [checkStripeDomainActions.isLoading]: (state, { payload }) => {
      return state.setIn(['stripeDomainCheck', 'loading'], payload);
    },
    [checkStripeDomainActions.error]: (state, { payload }) => {
      return state.setIn(['stripeDomainCheck', 'error'], payload);
    },
    [checkStripeDomainActions.success]: (state, { payload }) => {
      return state.setIn(
        ['stripeDomainCheck', 'isRegistered'],
        payload.is_registered,
      );
    },
  },
  initialState,
);
