import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';

import type { AxiosResponse } from 'axios';

import {
  checkMemberInEstablishmentActions,
  getMemberVisitListActions,
  globalMemberVisitActions,
  refreshMemberVisitAccessStatusActions,
  setMemberVisitEntryStatusActions,
} from './actions';

import type { PaginatedResponse } from '../../state/types';
import type { ErrorAndLoading, WithPagination } from '#libs/types';
import type { AccessControlState, MemberVisitREST } from './types';

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
    [checkMemberInEstablishmentActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<MemberVisitREST> },
    ) => {
      const memberVisit = payload.data;
      return state
        .setIn(
          ['memberVisit', 'allIds'],
          // FIXME: This changes the order of the memberVisit list
          uniq([...state.memberVisit.allIds, memberVisit.id]),
        )
        .merge(
          {
            memberVisit: {
              byId: {
                [memberVisit.id]: memberVisit,
              },
            },
          },
          { deep: true },
        );
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
    [refreshMemberVisitAccessStatusActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<MemberVisitREST> },
    ) => {
      const memberVisit = payload.data;
      return state
        .setIn(
          ['memberVisit', 'allIds'],
          uniq([...state.memberVisit.allIds, memberVisit.id]),
        )
        .merge(
          {
            memberVisit: {
              byId: {
                [memberVisit.id]: memberVisit,
              },
            },
          },
          { deep: true },
        );
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
    [setMemberVisitEntryStatusActions.success.toString()]: (
      state,
      { payload }: { payload: AxiosResponse<MemberVisitREST> },
    ) => {
      const memberVisit = payload.data;
      return state
        .setIn(
          ['memberVisit', 'allIds'],
          // FIXME: This changes the order of the memberVisit list
          uniq([...state.memberVisit.allIds, memberVisit.id]),
        )
        .merge(
          {
            memberVisit: {
              byId: {
                [memberVisit.id]: memberVisit,
              },
            },
          },
          { deep: true },
        );
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
  },
  initialState,
);
