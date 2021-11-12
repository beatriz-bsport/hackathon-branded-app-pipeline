import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import lodash from 'lodash';

import { actionTypes, PaymentPackState } from './types';
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
  listAllPaymentPackCategoryActions,
  upsertPaymenPackCategoryActions,
  deletePaymentPackCategoryActions,
  listPaymentPackActions,
  listPaymentPackTemplateActions,
  createOrUpdatePaymentPackTemplateActions,
  deletePaymentPackTemplateActions,
  retrievePaymentPackTemplateActions,
} from './actions';

const initialState: PaymentPackState = Immutable({
  updatingConsumerPacks: [],
  updatingPaymentPacks: [],
  createOrUpdatePending: false,
  loading: true,
  error: false,
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
  paymentPackTemplate: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
  },
  paymentPackCategory: {
    byId: {},
    allIds: [],
    loading: false,
    error: null,
    upsert: {
      loading: false,
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
    [fetchActivityCompatibleAction.reset.toString()]: (state) => {
      return state
        .setIn(['byActivity', 'allIds'], [])
        .setIn(['byActivity', 'page'], 1)
        .setIn(['byActivity', 'count'], 0);
    },
    [paymentPackForBookingActions.reset.toString()]: (state) => {
      return state.setIn(['forBooking', 'allIds'], []);
    },
    [paymentPackForBookingActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['forBooking', 'loading'], payload);
    },
    [updatePaymentPackActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('updatingPaymentPacks', [
        ...state.updatingPaymentPacks,
        payload,
      ]);
    },
    [updatePaymentPackActions.isNotLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set(
        'updatingPaymentPacks',
        state.updatingPaymentPacks.filter((p) => p !== payload),
      );
    },
    [updatePaymentPackActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [scalePaymentPackCreditActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['scaleCredit', 'loading'], payload);
    },
    [scalePaymentPackCreditActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['scaleCredit', 'error'], payload);
    },
    [listAllPaymentPackActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listAllPaymentPackActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listAllPaymentPackActions.success.toString()]: (state, { payload }) => {
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
    [listPaymentPackActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [listPaymentPackActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [listPaymentPackActions.success.toString()]: (state, { payload }) => {
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
    [listPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'loading'], payload);
    },
    [listPaymentPackTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['paymentPackTemplate', 'error'], payload);
    },
    [listPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['paymentPackTemplate', 'allIds'],
          payload.map((pp) => pp.id),
        )
        .merge(
          {
            paymentPackTemplate: {
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [deletePaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'upsert', 'loading'], payload);
    },
    [deletePaymentPackTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'upsert', 'error'], payload);
    },
    [deletePaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['paymentPackTemplate', 'byId', payload, 'disabled'],
        true,
      );
    },
    [retrievePaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'loading'], payload);
    },
    [retrievePaymentPackTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'error'], payload);
    },
    [retrievePaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'byId', payload.id], payload);
    },
    [createOrUpdatePaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'upsert', 'loading'], payload);
    },
    [createOrUpdatePaymentPackTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'upsert', 'error'], payload);
    },
    [createOrUpdatePaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['paymentPackTemplate', 'allIds'],
          [
            payload.id,
            ...state.paymentPackTemplate.allIds.filter(
              (id) => id !== payload.id,
            ),
          ],
        )
        .setIn(['paymentPackTemplate', 'byId', payload.id], payload);
    },
    [paymentPackForBookingActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [paymentPackForBookingActions.success.toString()]: (state, { payload }) => {
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
    [fetchActivityCompatibleAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['byActivity', 'loading'], payload);
    },
    [fetchActivityCompatibleAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['byActivity', 'error'], payload);
    },
    [fetchActivityCompatibleAction.success.toString()]: (
      state,
      { payload },
    ) => {
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
    [listPaymentPackCompatibleActions.success.toString()]: (
      state,
      { payload },
    ) => {
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
    [listPaymentPackCompatibleActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatible', 'loading'], payload);
    },
    [listPaymentPackCompatibleActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['compatible', 'error'], payload);
    },
    [listPaymentPackCompatibleActions.reset.toString()]: (state) => {
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
    [fetchMarketplacePacksAction.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('loading', payload);
    },
    [fetchMarketplacePacksAction.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [fetchMarketplacePacksAction.success.toString()]: (state, { payload }) => {
      return state.merge(
        { allIds: payload.paymentPacksAllIds, byId: payload.paymentPacksById },
        { deep: true },
      );
    },
    [paymentPackBulkActions.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [paymentPackBulkActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
    },
    [paymentPackBulkActions.success.toString()]: (state, { payload }) => {
      return state.merge({ byId: payload.paymentPacksById }, { deep: true });
    },
    [fetchOneAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchOneAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['byActivity', 'error'], payload);
    },
    [fetchOneAction.success.toString()]: (state, { payload }) => {
      return state.setIn(['byId', payload.id], payload);
    },

    [notificationCreateActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'create', 'loading'], payload);
    },
    [notificationCreateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'create', 'error'], payload);
    },
    [notificationCreateActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [notificationListActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'loading'], payload);
    },
    [notificationListActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'error'], payload);
    },
    [notificationListActions.success.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'itemsById'], payload);
    },
    [notificationUpdateActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'update', 'id'], payload);
    },
    [notificationUpdateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'update', 'error'], payload);
    },
    [notificationUpdateActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        { notification: { itemsById: { [payload.id]: payload } } },
        { deep: true },
      );
    },
    [notificationDeleteActions.isLoading.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'delete', 'loading'], payload);
    },
    [notificationDeleteActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['notification', 'delete', 'error'], payload);
    },
    [notificationDeleteActions.success.toString()]: (state, { payload }) => {
      const items = { ...state.notification.itemsById };
      delete items[payload];
      return state.setIn(['notification', 'itemsById'], items);
    },
    [listAllPaymentPackCategoryActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'loading'], payload);
    },
    [listAllPaymentPackCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'error'], payload);
    },
    [listAllPaymentPackCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['paymentPackCategory', 'allIds'],
          payload.results.map((pp) => pp.id),
        )
        .merge(
          {
            paymentPackCategory: {
              byId: payload.results.reduce(
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [upsertPaymenPackCategoryActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'upsert', 'loading'], payload);
    },
    [upsertPaymenPackCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'upsert', 'error'], payload);
    },
    [upsertPaymenPackCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      if (!state.paymentPackCategory.allIds.includes(payload.id)) {
        return state
          .setIn(['paymentPackCategory', 'byId', payload.id], payload)
          .setIn(
            ['paymentPackCategory', 'allIds'],
            [...state.paymentPackCategory.allIds, payload.id],
          );
      }
      return state.setIn(['paymentPackCategory', 'byId', payload.id], payload);
    },
    [deletePaymentPackCategoryActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'upsert', 'loading'], payload);
    },
    [deletePaymentPackCategoryActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'upsert', 'error'], payload);
    },
    [deletePaymentPackCategoryActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['paymentPackCategory', 'byId'],
          lodash.omit(state.paymentPackCategory.byId, payload.id),
        )
        .setIn(
          ['paymentPackCategory', 'allIds'],
          state.paymentPackCategory.allIds.filter((id) => id !== payload.id),
        );
    },
  },
  initialState,
);

export default (state = initialState, action = { type: null }) =>
  newPaymentPackReducer(paymentPackReducer(state, action), action);
