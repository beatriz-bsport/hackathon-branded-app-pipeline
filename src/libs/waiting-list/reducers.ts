// @ts-nocheck
import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  byOfferActions,
  discardOptionActions,
  registerOptionActions,
  configurationDetail,
  configurationUpdate,
  asConsumerActions,
  forBookingActions,
  forMemberActions,
} from './actions';

import type {
  WaitingListBookingOption,
  WaitingListConfiguration,
  WaitingListState,
} from './types';
import { PaginatedResponse } from '../../state/types';

const initialState: Immutable.Immutable<WaitingListState> =
  Immutable<WaitingListState>({
    option: {
      items: [],
      byId: {},
      loading: false,
      error: null,
      register: {
        loading: false,
        error: null,
      },
      forBooking: {
        loading: false,
        error: null,
        allIds: [],
      },
      discard: {
        loading: false,
        error: null,
      },
      forMember: {
        loading: false,
        error: null,
        allIds: [],
        page: 1,
        count: 0,
      },
    },
    configuration: {
      data: null,
      loading: false,
      error: null,
      update: {
        loading: false,
        error: null,
      },
    },
  });

export default handleActions<Immutable.Immutable<WaitingListState>, any>(
  {
    [configurationDetail.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['configuration', 'loading'], payload);
    },
    [configurationDetail.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['configuration', 'error'], payload);
    },
    [configurationDetail.success.toString()]: (
      state,
      { payload }: { payload: WaitingListConfiguration },
    ) => {
      return state.setIn(['configuration', 'data'], payload);
    },
    [configurationUpdate.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['configuration', 'update', 'loading'], payload);
    },
    [configurationUpdate.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['configuration', 'update', 'error'], payload);
    },

    [byOfferActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['option', 'loading'], payload);
    },
    [byOfferActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['option', 'error'], payload);
    },
    [byOfferActions.success.toString()]: (
      state,
      { payload }: { payload: WaitingListBookingOption[] },
    ) => {
      return state.setIn(['option', 'items'], payload);
    },
    [asConsumerActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['option', 'loading'], payload);
    },
    [asConsumerActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['option', 'error'], payload);
    },
    [asConsumerActions.success.toString()]: (
      state,
      { payload }: { payload: WaitingListBookingOption[] },
    ) => {
      return state.setIn(['option', 'items'], payload);
    },
    [forBookingActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['option', 'forBooking', 'loading'], payload);
    },
    [forBookingActions.reset.toString()]: (state) => {
      return state.setIn(['option', 'forBooking', 'allIds'], []);
    },
    [forBookingActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['option', 'forBooking', 'error'], payload);
    },
    [forBookingActions.success.toString()]: (
      state,
      { payload }: { payload: WaitingListBookingOption[] },
    ) => {
      return state
        .setIn(
          ['option', 'forBooking', 'allIds'],
          payload.map((bookingOption) => bookingOption.id),
        )
        .merge(
          {
            option: {
              byId: payload.reduce<{ [id: number]: WaitingListBookingOption }>(
                (acc, bookingOption) => ({
                  ...acc,
                  [bookingOption.id]: bookingOption,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [forMemberActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['option', 'forMember', 'error'], payload);
    },
    [forMemberActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['option', 'forMember', 'loading'], payload);
    },
    [forMemberActions.reset.toString()]: (state) => {
      return state
        .setIn(['option', 'forMember', 'allIds'], [])
        .setIn(['option', 'forMember', 'count'], 0);
    },
    [forMemberActions.success.toString()]: (
      state,
      {
        payload,
      }: {
        payload: PaginatedResponse<WaitingListBookingOption>;
      },
    ) => {
      return state
        .setIn(
          ['option', 'forMember', 'allIds'],
          payload.results.map((bookingOption) => bookingOption.id),
        )
        .setIn(['option', 'forMember', 'page'], payload.page)
        .setIn(['option', 'forMember', 'count'], payload.count)
        .merge(
          {
            option: {
              byId: payload.results.reduce<{
                [id: number]: WaitingListBookingOption;
              }>(
                (acc, bookingOption) => ({
                  ...acc,
                  [bookingOption.id]: bookingOption,
                }),
                {},
              ),
            },
          },
          { deep: true },
        );
    },

    [discardOptionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['option', 'discard', 'loading'], payload);
    },
    [discardOptionActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['option', 'discard', 'error'], payload);
    },
    [discardOptionActions.success.toString()]: (
      state,
      { payload }: { payload: WaitingListBookingOption },
    ) => {
      return state.setIn(
        [
          'option',
          'items',
          state.option.items.findIndex(
            (bookingOption) => bookingOption.id === payload.id,
          ),
        ],
        payload,
      );
    },
    [registerOptionActions.isLoading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['option', 'register', 'loading'], payload);
    },
    [registerOptionActions.error.toString()]: (
      state,
      { payload }: { payload: Error },
    ) => {
      return state.setIn(['option', 'register', 'error'], payload);
    },
    [registerOptionActions.success.toString()]: (
      state,
      { payload }: { payload: WaitingListBookingOption },
    ) => {
      return state.setIn(['option', 'items'], [...state.option.items, payload]);
    },
  },
  initialState,
);
