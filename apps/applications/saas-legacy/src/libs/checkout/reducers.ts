import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  retrieveBasket,
  currentBasket,
  createOrRefreshInternalAccountPrepaidLineActions,
  generatedObjectsActions,
  basketHistoryActions,
  assignInstalmentPaymentActions,
  fetchQuicksaleBasketsActions,
  createQuicksaleBasketActions,
  updateQuicksaleBasketMemberActions,
  dropQuicksaleBasketActions,
} from './actions';

import type {
  Basket,
  CheckoutState,
  GeneratedObject,
  QuicksaleMemberUpdateSuccess,
} from './types';

const initialState: Immutable.Immutable<CheckoutState> =
  Immutable<CheckoutState>({
    basket: {
      allIds: [],
      byId: {},
      current: {
        data: null,
        loading: false,
        updating: false,
        error: null,
        expiredItemRemovalStatusLoading: false,
      },
      history: {
        loading: false,
        error: null,
        items: [],
      },
      loading: false,
      error: null,
      generatedObjects: {
        loading: false,
        error: null,
        data: null,
      },
    },
  });

export default handleActions<Immutable.Immutable<CheckoutState>, any>(
  {
    [retrieveBasket.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [retrieveBasket.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [retrieveBasket.success.toString()]: (
      state,
      { payload }: { payload: Basket },
    ) => {
      return state.setIn(['basket', 'byId', payload.id], payload);
    },
    [currentBasket.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'current', 'loading'], payload);
    },
    [currentBasket.isUpdating.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'current', 'updating'], payload);
    },
    [currentBasket.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'current', 'error'], payload);
    },
    [currentBasket.success.toString()]: (
      state,
      { payload }: { payload: Basket },
    ) => {
      return state
        .setIn(['basket', 'current', 'data'], payload)
        .setIn(['basket', 'byId', payload.id], payload);
    },
    [currentBasket.isExpiredItemRemovalStatusLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(
        ['basket', 'current', 'expiredItemRemovalStatusLoading'],
        payload,
      );
    },
    [createOrRefreshInternalAccountPrepaidLineActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'current', 'updating'], payload);
    },
    [createOrRefreshInternalAccountPrepaidLineActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'current', 'error'], payload);
    },
    [createOrRefreshInternalAccountPrepaidLineActions.success.toString()]: (
      state,
      { payload }: { payload: Basket },
    ) => {
      return state
        .setIn(['basket', 'current', 'data'], payload)
        .setIn(['basket', 'byId', payload.id], payload);
    },
    [basketHistoryActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'history', 'error'], payload);
    },
    [basketHistoryActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'history', 'loading'], payload);
    },
    [basketHistoryActions.success.toString()]: (
      state,
      { payload }: { payload: Basket[] },
    ) => {
      return state.setIn(['basket', 'history', 'items'], payload).merge(
        {
          basket: {
            byId: payload.reduce(
              (acc, basket) => ({
                ...acc,
                [basket.id]: basket,
              }),
              {},
            ),
          },
        },
        { deep: true },
      );
    },

    [generatedObjectsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'generatedObjects', 'loading'], payload);
    },
    [generatedObjectsActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'generatedObjects', 'error'], payload);
    },
    [generatedObjectsActions.success.toString()]: (
      state,
      { payload }: { payload: GeneratedObject[] },
    ) => {
      return state.setIn(['basket', 'generatedObjects', 'data'], payload);
    },
    [assignInstalmentPaymentActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'current', 'updating'], payload);
    },
    [assignInstalmentPaymentActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [assignInstalmentPaymentActions.success.toString()]: (
      state,
      { payload }: { payload: Basket },
    ) => {
      return state.setIn(['basket', 'byId', payload.id], payload);
    },

    [fetchQuicksaleBasketsActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [fetchQuicksaleBasketsActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [fetchQuicksaleBasketsActions.success.toString()]: (
      state,
      { payload }: { payload: Basket[] },
    ) => {
      return state
        .setIn(
          ['basket', 'allIds'],
          payload.map((basket) => basket.id),
        )
        .merge(
          {
            basket: {
              byId: payload.reduce(
                (acc, basket) => ({
                  ...acc,
                  [basket.id]: basket,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [createQuicksaleBasketActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [createQuicksaleBasketActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [createQuicksaleBasketActions.success.toString()]: (
      state,
      { payload }: { payload: Basket },
    ) => {
      return state
        .setIn(['basket', 'allIds'], [...state.basket.allIds, payload.id])
        .setIn(['basket', 'byId', payload.id], payload);
    },

    [updateQuicksaleBasketMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [updateQuicksaleBasketMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [updateQuicksaleBasketMemberActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: QuicksaleMemberUpdateSuccess;
      },
    ) => {
      if (payload.updated_member) {
        return state
          .setIn(
            ['basket', 'allIds'],
            [
              ...state.basket.allIds.filter(
                (id) => id !== payload.previousBasketId,
              ),
              payload.newBasket.id,
            ],
          )
          .setIn(['basket', 'byId', payload.newBasket.id], payload.newBasket);
      }
      return state;
    },

    [dropQuicksaleBasketActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['basket', 'loading'], payload);
    },
    [dropQuicksaleBasketActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['basket', 'error'], payload);
    },
    [dropQuicksaleBasketActions.success.toString()]: (
      state,
      { payload }: { payload: { dropped: boolean; basketId: string } },
    ) => {
      if (payload.dropped) {
        return state.setIn(
          ['basket', 'allIds'],
          state.basket.allIds.filter((id) => id !== payload.basketId),
        );
      }
      return state;
    },
  },
  initialState,
);
