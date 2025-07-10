import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import omit from 'lodash/omit';
import uniq from 'lodash/uniq';
import type { PaginatedResponse } from '../../state/types';
import {
  actionTypes,
  PaymentPackMassExtension,
  PaymentPack,
  PaymentPackState,
  PaymentPackTemplateAPI,
} from './types';
import {
  fetchActivityCompatibleAction,
  fetchOneAction,
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
  createOrUpdateUniversalPaymentPackTemplateActions,
  deletePaymentPackTemplateActions,
  deleteUniversalPaymentPackTemplateActions,
  retrievePaymentPackTemplateActions,
  retrieveUniversalPaymentPackTemplateActions,
  updatePaymentPackOrderActions,
  updatePaymentPackCategoryOrderActions,
  isPaymentPackUsedInComboActions,
  paymentPackBulkWidgetActions,
  updatePaymentPackCompatibilitiesAction,
  fetchPaymentPackMassExtensionListActions,
  createPaymentPackMassExtensionActions,
  deletePaymentPackMassExtensionActions,
  listUniversalPaymentPackTemplateActions,
  restorePaymentPackTemplateActions,
  restoreUniversalPaymentPackTemplateActions,
} from './actions';

//@ts-expect-error
const initialState: PaymentPackState = Immutable({
  updatingConsumerPacks: [],
  updatingPaymentPacks: [],
  createOrUpdatePending: false,
  loading: false,
  error: false,
  archivationWarning: {},
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
  paymentPackTemplate: {
    byId: {},
    allIds: [],
    allIdsManagerOnly: [],
    loading: false,
    error: null,
    upsert: {
      loading: false,
      error: null,
    },
  },
  universalPaymentPackTemplate: {
    byId: {},
    allIds: [],
    allIdsManagerOnly: [],
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
  massExtension: {
    allIds: [],
    byId: {},
    count: 0,
    error: null,
    loading: false,
    next_page: 1,
    page: 1,
    create: {
      loading: false,
      error: null,
    },
    delete: {
      loading: false,
      error: null,
    },
  },
});

export function paymentPackReducer(state = initialState, action = {}) {
  // @ts-expect-error
  switch (action.type) {
    case actionTypes.HAS_FETCHED_ALL_PAYMENT_PACKS:
      // @ts-expect-error
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
        // @ts-expect-error
        action.consumerPackId,
      ];
      // @ts-expect-error
      return Immutable.merge(state, { updatingConsumerPacks });
    }
    case actionTypes.UPDATE_CONSUMER_PACK_CREDIT_FAILED:
    case actionTypes.UPDATE_CONSUMER_PACK_CREDIT_DONE: {
      // @ts-expect-error
      return Immutable.merge(state, {
        updatingConsumerPacks: state.updatingConsumerPacks.filter(
          // @ts-expect-error
          (id) => id !== action.consumerPackId,
        ),
      });
    }

    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_START: {
      // @ts-expect-error
      return Immutable.merge(state, { createOrUpdatePending: true });
    }
    // @ts-expect-error
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_ERROR: {
      // @ts-expect-error
      return Immutable.merge(state, { createOrUpdatePending: false });
    }
    case actionTypes.PAYMENT_PACK_CREATEORUPDATE_SUCCESS: {
      // @ts-expect-error
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
  // @ts-expect-error
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
    [updatePaymentPackActions.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['byId', payload.id], payload);
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
        // @ts-expect-error
        state.updatingPaymentPacks.filter((p) => p !== payload),
      );
    },
    [updatePaymentPackOrderActions.success.toString()]: (
      state,
      { payload },
    ) => {
      // @ts-expect-error
      return state.setIn(['byId', payload.id], payload);
    },
    [updatePaymentPackOrderActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('updatingPaymentPacks', [
        ...state.updatingPaymentPacks,
        payload,
      ]);
    },
    [updatePaymentPackOrderActions.error.toString()]: (state, { payload }) => {
      return state.set('error', payload);
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
          // @ts-expect-error
          (payload || payload.results).map((pp) => pp.id),
        )
        .merge(
          {
            // @ts-expect-error
            byId: (payload || payload.results).reduce(
              // @ts-expect-error
              (acc, v) => ({ ...acc, [v.id]: v }),
              {},
            ),
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
          // @ts-expect-error
          payload.map((pp) => pp.id),
        )
        .merge(
          {
            // @ts-expect-error
            byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
          },
          { deep: true },
        );
    },
    [listPaymentPackActions.reset.toString()]: (state, { payload }) => {
      // const propToCheck = Object.entries(payload);
      const requestedKeys = Object.keys(payload);

      const idToKeep = Object.values(state.byId).filter((pp) =>
        Object.entries(pp).reduce(
          (acc, [k, v]) =>
            // @ts-expect-error
            (!requestedKeys.includes(k) || v !== payload[k]) && acc,
          true,
        ),
      );

      return state
        .set(
          'allIds',
          idToKeep.map((pp) => pp.id),
        )
        .set(
          'byId',
          idToKeep.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
        );
    },
    // ===== DEPRECATED UNPAGINATED PAYMENTPACKTEMPLATE ACTIONS
    [listPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackTemplate', 'loading'], payload);
    },
    [listPaymentPackTemplateActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['paymentPackTemplate', 'error'], payload);
    },
    [listPaymentPackTemplateActions.reset.toString()]: (state) => {
      return state
        .setIn(['paymentPackTemplate', 'allIds'], [])
        .setIn(['paymentPackTemplate', 'allIdsManagerOnly'], [])
        .setIn(['paymentPackTemplate', 'byId'], {});
    },
    [listPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['paymentPackTemplate', 'allIds'],
          // @ts-expect-error
          payload.map((pp) => pp.id),
        )
        .merge(
          {
            paymentPackTemplate: {
              // @ts-expect-error
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [listPaymentPackTemplateActions.bulkSuccess.toString()]: (
      state,
      { payload }: { payload: PaymentPackTemplateAPI[] },
    ) => {
      return state
        .setIn(
          ['paymentPackTemplate', 'allIds'],
          uniq([
            ...payload.map((pp) => pp.id),
            ...state.paymentPackTemplate.allIds,
          ]),
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
    [listPaymentPackTemplateActions.successManagerOnly.toString()]: (
      state,
      { payload },
    ) => {
      return state
        .setIn(
          ['paymentPackTemplate', 'allIdsManagerOnly'],
          // @ts-expect-error
          payload.map((pp) => pp.id),
        )
        .merge(
          {
            paymentPackTemplate: {
              // @ts-expect-error
              byId: payload.reduce((acc, v) => ({ ...acc, [v.id]: v }), {}),
            },
          },
          { deep: true },
        );
    },
    [listUniversalPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['universalPaymentPackTemplate', 'loading'], payload);
    },
    [listUniversalPaymentPackTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['universalPaymentPackTemplate', 'error'], payload);
    },
    [listUniversalPaymentPackTemplateActions.reset.toString()]: (state) => {
      return state
        .setIn(['universalPaymentPackTemplate', 'allIds'], [])
        .setIn(['universalPaymentPackTemplate', 'allIdsManagerOnly'], [])
        .setIn(['universalPaymentPackTemplate', 'byId'], {});
    },
    [listUniversalPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentPackTemplateAPI[] },
    ) => {
      return state
        .setIn(
          ['universalPaymentPackTemplate', 'allIds'],
          payload.map((paymentPackTemplate) => paymentPackTemplate.id),
        )
        .merge(
          {
            universalPaymentPackTemplate: {
              byId: payload.reduce(
                (acc, paymentPackTemplate) => ({
                  ...acc,
                  [paymentPackTemplate.id]: paymentPackTemplate,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [listUniversalPaymentPackTemplateActions.successManagerOnly.toString()]: (
      state,
      { payload }: { payload: PaymentPackTemplateAPI[] },
    ) => {
      return state
        .setIn(
          ['universalPaymentPackTemplate', 'allIdsManagerOnly'],
          payload.map((paymentPackTemplate) => paymentPackTemplate.id),
        )
        .merge(
          {
            universalPaymentPackTemplate: {
              byId: payload.reduce(
                (acc, paymentPackTemplate) => ({
                  ...acc,
                  [paymentPackTemplate.id]: paymentPackTemplate,
                }),
                {},
              ),
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
        // @ts-expect-error
        ['paymentPackTemplate', 'byId', payload, 'disabled'],
        true,
      );
    },
    [restorePaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['paymentPackTemplate', 'upsert', 'loading'], payload);
    },
    [restorePaymentPackTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['paymentPackTemplate', 'upsert', 'error'], payload);
    },
    [restorePaymentPackTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentPackTemplateAPI },
    ) => {
      return state.setIn(['paymentPackTemplate', 'byId', payload.id], payload);
    },
    [deleteUniversalPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'upsert', 'loading'],
        payload,
      );
    },
    [deleteUniversalPaymentPackTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'upsert', 'error'],
        payload,
      );
    },
    [deleteUniversalPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['universalPaymentPackTemplate', 'byId', payload, 'disabled'],
        true,
      );
    },

    [restoreUniversalPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'upsert', 'loading'],
        payload,
      );
    },
    [restoreUniversalPaymentPackTemplateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'upsert', 'error'],
        payload,
      );
    },
    [restoreUniversalPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload }: { payload: PaymentPackTemplateAPI },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'byId', payload.id],
        payload,
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
      // @ts-expect-error
      return state.setIn(['paymentPackTemplate', 'byId', payload.id], payload);
    },
    [retrieveUniversalPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['universalPaymentPackTemplate', 'loading'], payload);
    },
    [retrieveUniversalPaymentPackTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['universalPaymentPackTemplate', 'error'], payload);
    },
    [retrieveUniversalPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['universalPaymentPackTemplate', 'byId', payload.id],
        payload,
      );
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
      let newState = state;
      // @ts-expect-error
      if (payload.manager_only || !payload.is_usable_by_staff)
        newState = state.setIn(
          ['paymentPackTemplate', 'allIdsManagerOnly'],
          [
            // @ts-expect-error
            payload.id,
            ...state.paymentPackTemplate.allIdsManagerOnly.filter(
              // @ts-expect-error
              (id) => id !== payload.id,
            ),
          ],
        );
      return (
        newState
          .setIn(
            ['paymentPackTemplate', 'allIds'],
            [
              // @ts-expect-error
              payload.id,
              ...state.paymentPackTemplate.allIds.filter(
                // @ts-expect-error
                (id) => id !== payload.id,
              ),
            ],
          )
          // @ts-expect-error
          .setIn(['paymentPackTemplate', 'byId', payload.id], payload)
      );
    },
    [createOrUpdateUniversalPaymentPackTemplateActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'upsert', 'loading'],
        payload,
      );
    },
    [createOrUpdateUniversalPaymentPackTemplateActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        ['universalPaymentPackTemplate', 'upsert', 'error'],
        payload,
      );
    },
    [createOrUpdateUniversalPaymentPackTemplateActions.success.toString()]: (
      state,
      { payload },
    ) => {
      let newState = state;
      // @ts-expect-error
      if (payload.manager_only || !payload.is_usable_by_staff)
        newState = state.setIn(
          ['universalPaymentPackTemplate', 'allIdsManagerOnly'],
          [
            // @ts-expect-error
            payload.id,
            ...state.universalPaymentPackTemplate.allIdsManagerOnly.filter(
              // @ts-expect-error
              (id) => id !== payload.id,
            ),
          ],
        );
      return (
        newState
          .setIn(
            ['universalPaymentPackTemplate', 'allIds'],
            [
              // @ts-expect-error
              payload.id,
              ...state.universalPaymentPackTemplate.allIds.filter(
                // @ts-expect-error
                (id) => id !== payload.id,
              ),
            ],
          )
          // @ts-expect-error
          .setIn(['universalPaymentPackTemplate', 'byId', payload.id], payload)
      );
    },
    [paymentPackForBookingActions.error.toString()]: (state, { payload }) => {
      return state.setIn(['forBooking', 'error'], payload);
    },
    [paymentPackForBookingActions.success.toString()]: (state, { payload }) => {
      return state.merge(
        {
          forBooking: {
            allIds: [
              ...state.forBooking.allIds,
              // @ts-expect-error
              ...payload.results
                // @ts-expect-error
                .filter((pp) => !state.forBooking.allIds.includes(pp.id))
                // @ts-expect-error
                .map((pp) => pp.id),
            ],
            // @ts-expect-error
            count: payload.count,
            // @ts-expect-error
            page: payload.next_page,
          },
          // @ts-expect-error
          byId: payload.results.reduce(
            // @ts-expect-error
            (acc, v) => ({ ...acc, [v.id]: v }),
            state.byId,
          ),
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
            // @ts-expect-error
            allIds: payload.paymentPacksAllIds,
            // @ts-expect-error
            count: payload.count,
            // @ts-expect-error
            page: payload.page,
          },
          // @ts-expect-error
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
            // @ts-expect-error
            allIds: payload.results.map((pp) => pp.id),
            // @ts-expect-error
            count: payload.count,
            // @ts-expect-error
            next_page: payload.next_page,
          },
          // @ts-expect-error
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
            // @ts-expect-error
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
        // @ts-expect-error
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
      // @ts-expect-error
      return state.merge({ byId: payload.paymentPacksById }, { deep: true });
    },
    [paymentPackBulkWidgetActions.success.toString()]: (
      state,
      { payload }: { payload: { results: PaymentPack[] } },
    ) => {
      const { results } = payload;
      return state.merge(
        {
          byId: (results ?? []).reduce<{ [id: number]: PaymentPack }>(
            (acc, paymentPack) => {
              acc[paymentPack.id] = paymentPack;
              return acc;
            },
            {},
          ),
        },
        { deep: true },
      );
    },
    [fetchOneAction.isLoading.toString()]: (state, { payload }) => {
      return state.set('loading', payload);
    },
    [fetchOneAction.error.toString()]: (state, { payload }) => {
      return state.setIn(['byActivity', 'error'], payload);
    },
    [fetchOneAction.success.toString()]: (state, { payload }) => {
      // @ts-expect-error
      return state.setIn(['byId', payload.id], payload);
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
          // @ts-expect-error
          payload.results.map((pp) => pp.id),
        )
        .merge(
          {
            paymentPackCategory: {
              // @ts-expect-error
              byId: payload.results.reduce(
                // @ts-expect-error
                (acc, v) => ({ ...acc, [v.id]: v }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [updatePaymentPackCategoryOrderActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'upsert', 'loading'], payload);
    },
    [updatePaymentPackCategoryOrderActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(['paymentPackCategory', 'error', 'loading'], payload);
    },
    [updatePaymentPackCategoryOrderActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.merge(
        {
          paymentPackCategory: {
            // @ts-expect-error
            byId: payload.reduce(
              // @ts-expect-error
              (acc, v) => ({ ...acc, [v.id]: v }),
              state.paymentPackCategory.byId,
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
      // @ts-expect-error
      if (!state.paymentPackCategory.allIds.includes(payload.id)) {
        return (
          state
            // @ts-expect-error
            .setIn(['paymentPackCategory', 'byId', payload.id], payload)
            .setIn(
              ['paymentPackCategory', 'allIds'],
              // @ts-expect-error
              [...state.paymentPackCategory.allIds, payload.id],
            )
        );
      }
      // @ts-expect-error
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
          // @ts-expect-error
          omit(state.paymentPackCategory.byId, payload.id),
        )
        .setIn(
          ['paymentPackCategory', 'allIds'],
          // @ts-expect-error
          state.paymentPackCategory.allIds.filter((id) => id !== payload.id),
        );
    },
    [isPaymentPackUsedInComboActions.isLoading.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('isLoading', payload);
    },
    [isPaymentPackUsedInComboActions.error.toString()]: (
      state,
      { payload },
    ) => {
      return state.set('error', payload);
    },
    [isPaymentPackUsedInComboActions.success.toString()]: (
      state,
      { payload },
    ) => {
      return state.setIn(
        // @ts-expect-error
        ['archivationWarning', payload.id, 'used_in_combo'],
        // @ts-expect-error
        payload.is_used_in_payment_combo,
      );
    },
    [updatePaymentPackCompatibilitiesAction.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.set('isLoading', payload);
    },
    [updatePaymentPackCompatibilitiesAction.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.set('error', payload);
    },
    [updatePaymentPackCompatibilitiesAction.success.toString()]: (
      state,
      { payload }: { payload: PaymentPack },
    ) => {
      return state.setIn(['byId', payload.id], payload);
    },
    [fetchPaymentPackMassExtensionListActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['massExtension', 'loading'], payload);
    },
    [fetchPaymentPackMassExtensionListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['massExtension', 'error'], payload);
    },
    [fetchPaymentPackMassExtensionListActions.success.toString()]: (
      state,
      { payload }: { payload: PaginatedResponse<PaymentPackMassExtension> },
    ) => {
      const { page, next_page, count, results } = payload;
      return state
        .setIn(['massExtension', 'page'], page)
        .setIn(['massExtension', 'next_page'], next_page)
        .setIn(['massExtension', 'count'], count)
        .setIn(
          ['massExtension', 'allIds'],
          results.map((massExtension) => massExtension.id),
        )
        .merge(
          {
            massExtension: {
              byId: results.reduce<{
                [extensionId: number]: PaymentPackMassExtension;
              }>((accumulator, massExtension) => {
                accumulator[massExtension.id] = massExtension;
                return accumulator;
              }, {}),
            },
          },
          { deep: true },
        );
    },
    [createPaymentPackMassExtensionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['massExtension', 'create', 'loading'], payload);
    },
    [createPaymentPackMassExtensionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['massExtension', 'create', 'error'], payload);
    },
    [deletePaymentPackMassExtensionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['massExtension', 'delete', 'loading'], payload);
    },
    [deletePaymentPackMassExtensionActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['massExtension', 'delete', 'error'], payload);
    },
  },
  initialState,
);

export default (
  state = initialState,
  action: { type: typeof actionTypes | null } = { type: null },
) =>
  // @ts-expect-error
  newPaymentPackReducer(paymentPackReducer(state, action), action);
