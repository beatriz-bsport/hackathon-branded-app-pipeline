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
} from './actions';

const initialState = Immutable({
  all: [],
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
  byId: {},
  allIds: [],
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
        all: Array.from(action.paymentPacks),
        loading: false,
        error: false,
        updatingPaymentPacks: [],
        updatingConsumerPacks: [],
        createOrUpdatePending: false,
      });

    case actionTypes.START_FETCH_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, { loading: true, error: false });

    case actionTypes.ERROR_FETCHING_ALL_PAYMENT_PACKS:
      return Immutable.merge(state, {
        loading: false,
        error: true,
        errorMsg: action.err,
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

    case actionTypes.PAYMENT_PACK_PATCH_START:
      return Immutable.merge(state, {
        updatingPaymentPacks: [...state.updatingPaymentPacks, action.id],
      });

    case actionTypes.PAYMENT_PACK_PATCH_ERROR:
      return Immutable.merge(state, {
        updatingPaymentPacks: [
          ...state.updatingPaymentPacks.filter((id) => id !== action.id),
        ],
      });

    case actionTypes.PAYMENT_PACK_PATCH_SUCCESS: {
      const { paymentPack } = action;
      return state.merge(
        {
          updatingPaymentPacks: [
            ...state.updatingPaymentPacks.filter((id) => id !== action.id),
          ],
          all: [
            paymentPack,
            ...state.all.filter((pp) => pp.id !== paymentPack.id),
          ],
          byId: { [paymentPack.id]: paymentPack },
        },
        { deep: true },
      );
    }

    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_START: {
      return Immutable.merge(state, { createOrUpdatePending: true });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_ERROR: {
      return Immutable.merge(state, { createOrUpdatePending: false });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_SUCCESS: {
      const { paymentPack } = action;
      const paymentPackArray = state.all.filter(
        (pp) => pp.id !== paymentPack.id,
      );
      return Immutable.merge(state, {
        all: [paymentPack, ...paymentPackArray],
        createOrUpdatePending: false,
      });
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
      return state.merge(
        { allIds: payload.paymentPacksAllIds, byId: payload.paymentPacksById },
        { deep: true },
      );
    },
    [fetchOneAction.isLoading]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchOneAction.error]: (state, { payload }) => {
      return state.setIn(['byActivity', 'error'], payload);
    },
    [fetchOneAction.success]: (state, { payload }) => {
      return state.merge(
        {
          byId: { [payload.id]: payload },
        },
        { deep: true },
      );
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
