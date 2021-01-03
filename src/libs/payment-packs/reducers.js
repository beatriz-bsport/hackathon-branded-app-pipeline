import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import { actionTypes } from './types';
import {
  fetchActivityCompatibleAction,
  fetchOneAction,
  notificationCreateActions,
  notificationListActions,
  notificationUpdateActions,
  notificationDeleteActions,
  fetchMarketplacePacksAction,
  paymentPackBulkActions,
  paymentPackForBookingActions,
  listAllPaymentPackActions,
  updatePaymentPackActions,
  scalePaymentPackCreditActions,
  listPaymentPackCompatibleActions,
} from './actions';

const initialState = Immutable({
  updatingConsumerPacks: [],
  updatingPaymentPacks: [],
  createOrUpdatePending: false,
  loading: true,
  error: false,
  errorMsg: '',
  byActivity: {
    loading: false,
    error: null,
    allIds: [],
    page: 1,
    count: 0,
  },
  forBooking: {
    allIds: [],
    loading: false,
    error: null,
  },
  scaleCredit: {
    loading: false,
    error: null,
  },
  byId: {},
  allIds: [],
  compatible: {
    allIds: [],
    loading: false,
    error: null,
  },
  notification: {
    itemsById: {},
    loading: false,
    error: null,
    create: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
    update: {
      id: null,
      error: null,
    },
  },
});

export function paymentPackReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        loading: false,
        error: false,
        updatingPaymentPacks: [],
        updatingConsumerPacks: [],
        createOrUpdatePending: false,
      });

    case actionTypes.UPDATING_CONSUMER_PACK_CREDIT: {
      const updatingConsumerPacks = [
        ...state.updatingConsumerPacks,
        action.consumerPackId,
      ];
      return Immutable.merge(state, { updatingConsumerPacks });
    }
    case actionTypes.UPDATE_CONSUMER_PACK_CREDIT_FAILED:
    case actionTypes.UPDATE_CONSUMER_PACK_CREDIT_DONE: {
      return Immutable.merge(state, {
        updatingConsumerPacks: state.updatingConsumerPacks.filter(
          (id) => id !== action.consumerPackId,
        ),
      });
    }

    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_START: {
      return Immutable.merge(state, { createOrUpdatePending: true });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_ERROR: {
      return Immutable.merge(state, { createOrUpdatePending: false });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_SUCCESS: {
      const { paymentPack } = action;
      return state
        .set('createOrUpdatePending', false)
        .setIn(['byId', paymentPack.id], paymentPack);
    }

    case actionTypes.RESET_ACTIVITY_COMPATIBLE_PAYMENT_PACKS:
      return state
        .setIn(['byActivity', 'allIds'], [])
        .setIn(['byActivity', 'page'], 1)
        .setIn(['byActivity', 'count'], 0);

    default:
      return state;
  }
}

export const newPaymentPackReducer = handleActions(
  {
    [fetchActivityCompatibleAction.reset]: (state) => {
      return state
        .setIn(['byActivity', 'allIds'], [])
        .setIn(['byActivity', 'page'], 1)
        .setIn(['byActivity', 'count'], 0);
    },
    [paymentPackForBookingActions.reset]: (state) => {
      return state.setIn(['forBooking', 'allIds'], []);
    },
    [paymentPackForBookingActions.isLoading]: (state, { payload }) => {
      return state.setIn(['forBooking', 'loading'], payload);
    },
    [updatePaymentPackActions.isLoading]: (state, { payload }) => {
      return state.set('updatingPaymentPacks', [
        ...state.updatingPaymentPacks,
        payload,
      ]);
    },
    [updatePaymentPackActions.isNotLoading]: (state, { payload }) => {
      return state.set(
        'updatingPaymentPacks',
        state.updatingPaymentPacks.filter((p) => p !== payload),
      );
    },
    [updatePaymentPackActions.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [listAllPaymentPackActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listAllPaymentPackActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [scalePaymentPackCreditActions.isLoading]: (state, { payload }) => {
      return state.setIn(['scaleCredit', 'loading'], payload);
    },
    [scalePaymentPackCreditActions.error]: (state, { payload }) => {
      return state.setIn(['scaleCredit', 'error'], payload);
    },
    [listAllPaymentPackActions.success]: (state, { payload }) => {
      return state
        .set(
          'allIds',
          payload.map((pp) => pp.id),
        )
        .merge(
          {
            byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
          },
          { deep: true },
        );
    },
    [paymentPackForBookingActions.error]: (state, { payload }) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [paymentPackForBookingActions.success]: (state, { payload }) => {
      return state.merge(
        {
          forBooking: {
            allIds: payload.results.map((pp) => pp.id),
            count: payload.count,
            page: payload.page,
          },
          byId: payload.results.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
        },
        { deep: true },
      );
    },
    [fetchActivityCompatibleAction.isLoading]: (state, { payload }) => {
      return state.setIn(['byActivity', 'loading'], payload);
    },
    [fetchActivityCompatibleAction.error]: (state, { payload }) => {
      return state.setIn(['byActivity', 'error'], payload);
    },
    [fetchActivityCompatibleAction.success]: (state, { payload }) => {
      return state.merge(
        {
          byActivity: {
            allIds: payload.paymentPacksAllIds,
            count: payload.count,
            page: payload.page,
          },
          byId: payload.paymentPacksById,
        },
        { deep: true },
      );
    },
    [listPaymentPackCompatibleActions.success]: (state, { payload }) => {
      return state.merge(
        {
          compatible: {
            allIds: payload.results.map((pp) => pp.id),
            count: payload.count,
            next_page: payload.next_page,
          },
          byId: payload.results.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
        },
        { deep: true },
      );
    },
    [listPaymentPackCompatibleActions.isLoading]: (state, { payload }) => {
      return state.setIn(['compatible', 'loading'], payload);
    },
    [listPaymentPackCompatibleActions.error]: (state, { payload }) => {
      return state.setIn(['compatible', 'error'], payload);
    },
    [listPaymentPackCompatibleActions.reset]: (state) => {
      return state.merge(
        {
          compatible: {
            allIds: [],
            count: 0,
            next_page: 1,
          },
        },
        { deep: true },
      );
    },
    [fetchMarketplacePacksAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchMarketplacePacksAction.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchMarketplacePacksAction.success]: (state, { payload }) => {
      return state.merge(
        { allIds: payload.paymentPacksAllIds, byId: payload.paymentPacksById },
        { deep: true },
      );
    },
    [paymentPackBulkActions.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [paymentPackBulkActions.error]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [paymentPackBulkActions.success]: (state, { payload }) => {
      return state.merge({ byId: payload.paymentPacksById }, { deep: true });
    },
    [fetchOneAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchOneAction.error]: (state, { payload }) => {
      return state.setIn(['byActivity', 'error'], payload);
    },
    [fetchOneAction.success]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },

    [notificationCreateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'create', 'loading'], payload);
    },
    [notificationCreateActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'create', 'error'], payload);
    },
    [notificationCreateActions.success]: (state, { payload }) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [notificationListActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'loading'], payload);
    },
    [notificationListActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'error'], payload);
    },
    [notificationListActions.success]: (state, { payload }) => {
      return state.setIn(['notification', 'itemsById'], payload);
    },
    [notificationUpdateActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'update', 'id'], payload);
    },
    [notificationUpdateActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'update', 'error'], payload);
    },
    [notificationUpdateActions.success]: (state, { payload }) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [notificationDeleteActions.isLoading]: (state, { payload }) => {
      return state.setIn(['notification', 'delete', 'loading'], payload);
    },
    [notificationDeleteActions.error]: (state, { payload }) => {
      return state.setIn(['notification', 'delete', 'error'], payload);
    },
    [notificationDeleteActions.success]: (state, { payload }) => {
      const items = { ...state.notification.itemsById };
      delete items[payload];
      return state.setIn(['notification', 'itemsById'], items);
    },
  },
  initialState,
);

export default (state = initialState, action = { type: null }) =>
  newPaymentPackReducer(paymentPackReducer(state, action), action);
