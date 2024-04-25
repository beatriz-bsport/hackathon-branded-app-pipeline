import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';

import type { AxiosResponse } from 'axios';

import {
  checkMemberInEstablishmentActions,
  getAccessControlPolicyActions,
  retrieveMemberNextBookingOrPrivateBookingActions,
  getMemberVisitListActions,
  globalMemberVisitActions,
  patchAccessControlPolicyActions,
  refreshMemberVisitAccessStatusActions,
  setMemberVisitEntryStatusActions,
} from './actions';

import type { PaginatedResponse } from '#state/types';
import type { ErrorAndLoading, WithPagination } from '#libs/types';
import type {
  AccessControlBookingOrPrivateBooking,
  AccessControlPolicy,
  AccessControlState,
  MemberVisitREST,
} from './types';

const basePaginationErrorAndLoading: ErrorAndLoading & WithPagination = {
  page: 0,
  next_page: null,
  count: 0,
  loading: false,
  error: null,
};

export const initialState: Immutable.Immutable<AccessControlState> =
  Immutable<AccessControlState>({
    memberVisit: {
      ...basePaginationErrorAndLoading,
      byId: {},
      allIds: [],
    },
    policy: {
      loading: false,
      error: null,
      policy: {
        booked_session_time_interval_after_visit: '',
        booked_session_time_interval_before_visit: '',
      },
    },
    nextBookingOrPrivateBooking: {
      loading: false,
      error: null,
      bookingOrPrivateBooking: null,
    },
  });

export default handleActions<Immutable.Immutable<AccessControlState>, any>(
  {
    [globalMemberVisitActions.clear.toString()]: (state) => {
      return state
        .setIn(['memberVisit', 'page'], 0)
        .setIn(['memberVisit', 'next_page'], null)
        .setIn(['memberVisit', 'count'], 0)
        .setIn(['memberVisit', 'byId'], {})
        .setIn(['memberVisit', 'allIds'], []);
    },
    [globalMemberVisitActions.create.toString()]: (
      state,
      { payload }: { payload: MemberVisitREST },
    ) => {
      return state
        .setIn(
          ['memberVisit', 'allIds'],
          // TODO: Review pagination. If page != 1, we should not add the new memberVisit to the list
          uniq([payload.id, ...state.memberVisit.allIds]),
        )
        .merge(
          {
            memberVisit: {
              byId: {
                [payload.id]: payload,
              },
            },
          },
          { deep: true },
        );
    },

    [globalMemberVisitActions.update.toString()]: (
      state,
      { payload }: { payload: MemberVisitREST },
    ) => {
      return state.merge(
        {
          memberVisit: {
            byId: {
              [payload.id]: payload,
            },
          },
        },
        { deep: true },
      );
    },

    [checkMemberInEstablishmentActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['memberVisit', 'error'], payload);
    },
    [checkMemberInEstablishmentActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['memberVisit', 'loading'], payload);
    },

    [refreshMemberVisitAccessStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['memberVisit', 'error'], payload);
    },
    [refreshMemberVisitAccessStatusActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['memberVisit', 'loading'], payload);
    },

    [setMemberVisitEntryStatusActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['memberVisit', 'error'], payload);
    },
    [setMemberVisitEntryStatusActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['memberVisit', 'loading'], payload);
    },

    [getMemberVisitListActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['memberVisit', 'error'], payload);
    },
    [getMemberVisitListActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['memberVisit', 'loading'], payload);
    },
    [getMemberVisitListActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: AxiosResponse<PaginatedResponse<MemberVisitREST>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['memberVisit', 'next_page'], next_page)
        .setIn(['memberVisit', 'count'], count)
        .setIn(['memberVisit', 'page'], page)
        .setIn(
          ['memberVisit', 'allIds'],
          uniq([
            ...state.memberVisit.allIds,
            ...results.map((memberVisit) => memberVisit.id),
          ]),
        )
        .merge(
          {
            memberVisit: {
              byId: results.reduce(
                (acc: Record<number, MemberVisitREST>, memberVisit) => {
                  acc[memberVisit.id] = memberVisit;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [getAccessControlPolicyActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['policy', 'error'], payload);
    },
    [getAccessControlPolicyActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['policy', 'loading'], payload);
    },
    [getAccessControlPolicyActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<AccessControlPolicy> },
    ) => {
      const policy = payload.data;
      return state.merge(
        {
          policy: {
            policy,
          },
        },
        { deep: true },
      );
    },
    [patchAccessControlPolicyActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['policy', 'error'], payload);
    },
    [patchAccessControlPolicyActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['policy', 'loading'], payload);
    },
    [patchAccessControlPolicyActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<AccessControlPolicy> },
    ) => {
      const policy = payload.data;
      return state.merge(
        {
          policy: {
            policy,
          },
        },
        { deep: true },
      );
    },
    [retrieveMemberNextBookingOrPrivateBookingActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state
        .setIn(['nextBookingOrPrivateBooking', 'error'], payload)
        .setIn(
          ['nextBookingOrPrivateBooking', 'bookingOrPrivateBooking'],
          null,
        );
    },
    [retrieveMemberNextBookingOrPrivateBookingActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['nextBookingOrPrivateBooking', 'loading'], payload);
    },
    [retrieveMemberNextBookingOrPrivateBookingActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: AxiosResponse<AccessControlBookingOrPrivateBooking> },
    ) => {
      const bookingOrPrivateBooking = payload.data;
      return state.setIn(
        ['nextBookingOrPrivateBooking', 'bookingOrPrivateBooking'],
        bookingOrPrivateBooking,
      );
    },
  },
  initialState,
);
