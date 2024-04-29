import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';

import type { AxiosResponse } from 'axios';

import {
  approvePhotoUpdateActions,
  checkMemberInEstablishmentActions,
  getAccessControlPolicyActions,
  retrieveMemberNextBookingOrPrivateBookingActions,
  getMemberVisitListActions,
  getUserPhotoUpdatesActions,
  globalMemberVisitActions,
  patchAccessControlPolicyActions,
  refreshMemberVisitAccessStatusActions,
  setMemberVisitEntryStatusActions,
} from './actions';
import { FETCH_MEMBER_VISIT_PAGE_SIZE } from './constants';

import type { PaginatedResponse } from '#state/types';
import type { ErrorAndLoading, WithPagination } from '#libs/types';
import type {
  AccessControlBookingOrPrivateBooking,
  AccessControlPolicy,
  AccessControlState,
  MemberVisitREST,
  UserPhotoUpdate,
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
    userPhotoUpdate: {
      ...basePaginationErrorAndLoading,
      byId: {},
      allIds: [],
    },
  });

export default handleActions<Immutable.Immutable<AccessControlState>, any>(
  {
    [globalMemberVisitActions.create.toString()]: (
      state,
      { payload }: { payload: MemberVisitREST },
    ) => {
      let newIds = [];

      if (state.memberVisit.page === 1) {
        // The new member visit is inserted on top of the list
        newIds = uniq([payload.id, ...state.memberVisit.allIds]).slice(
          0,
          // The last member visit is removed if the list is full
          FETCH_MEMBER_VISIT_PAGE_SIZE,
        );
      } else {
        newIds = [...state.memberVisit.allIds];
      }

      return state
        .setIn(['memberVisit', 'allIds'], newIds)
        .setIn(['memberVisit', 'count'], state.memberVisit.count + 1)
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
          uniq(results.map((memberVisit) => memberVisit.id)),
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
    [getUserPhotoUpdatesActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['userPhotoUpdate', 'error'], payload);
    },
    [getUserPhotoUpdatesActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['userPhotoUpdate', 'loading'], payload);
    },
    [getUserPhotoUpdatesActions.success.toString()]: (
      state,
      {
        payload,
      }: { payload: AxiosResponse<PaginatedResponse<UserPhotoUpdate>> },
    ) => {
      const { next_page, results, count, page } = payload.data;

      return state
        .setIn(['userPhotoUpdate', 'next_page'], next_page)
        .setIn(['userPhotoUpdate', 'count'], count)
        .setIn(['userPhotoUpdate', 'page'], page)
        .setIn(
          ['userPhotoUpdate', 'allIds'],
          uniq(results.map((userPhotoUpdate) => userPhotoUpdate.uuid)),
        )
        .merge(
          {
            userPhotoUpdate: {
              byId: results.reduce(
                (acc: Record<string, UserPhotoUpdate>, userPhotoUpdate) => {
                  acc[userPhotoUpdate.uuid] = userPhotoUpdate;
                  return acc;
                },
                {},
              ),
            },
          },
          { deep: true },
        );
    },
    [approvePhotoUpdateActions.error.toString()]: (
      state,
      { payload }: { payload: Error | null },
    ) => {
      return state.setIn(['userPhotoUpdate', 'error'], payload);
    },
    [approvePhotoUpdateActions.loading.toString()]: (
      state,
      { payload }: { payload: boolean },
    ) => {
      return state.setIn(['userPhotoUpdate', 'loading'], payload);
    },
    [approvePhotoUpdateActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<UserPhotoUpdate> },
    ) => {
      const userPhotoUpdate = payload.data;
      return state.merge(
        {
          userPhotoUpdate: {
            byId: {
              [userPhotoUpdate.uuid]: userPhotoUpdate,
            },
          },
        },
        { deep: true },
      );
    },
  },
  initialState,
);
