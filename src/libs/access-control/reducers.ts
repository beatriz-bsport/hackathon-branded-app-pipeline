import Immutable from 'seamless-immutable';
import uniq from 'lodash/uniq';
import { handleActions } from 'redux-actions';

import type { AxiosResponse } from 'axios';

import { checkMemberInEstablishmentActions } from './actions';

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
  },
  initialState,
);
