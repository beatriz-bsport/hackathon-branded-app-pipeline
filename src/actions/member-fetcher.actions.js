// @flow

import { createAction } from 'redux-actions';

import api from '../api';
import type { Dispatch } from '../state/types';

export const details = {
  isLoading: createAction('MEMBER/DETAILS/IS_LOADING'),
  error: createAction('MEMBER/DETAILS/ERROR'),
  success: createAction('MEMBER/DETAILS/SUCCESS'),
  reset: createAction('MEMBER/DETAIL/RESET'),
};

const REFRESH_INTERVAL = 1000 * 60;

export function reset() {
  return async (dispatch: Dispatch) => {
    dispatch(details.reset());
  };
}

export function fetch(memberId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(details.isLoading(memberId));
    dispatch(details.error([null, null]));
    try {
      const response = await api.member.fetchMember(memberId);
      dispatch(details.success(response.data));
    } catch (error) {
      setTimeout(() => {
        dispatch(details.error([error, memberId]));
      }, 15000);
    }
  };
}

export function fetchIfOld(memberId: number) {
  return async (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const matchingMember = state.memberFetcher.details.find(
      (m) => m.id === memberId,
    );
    const matchingMemberIsLoading = (state.memberFetcher.loading || []).find(
      (id) => id === memberId,
    );
    if (
      !matchingMemberIsLoading &&
      (!matchingMember ||
        matchingMember.lastUpdated > +new Date() + REFRESH_INTERVAL)
    ) {
      dispatch(fetch(memberId));
    }
  };
}
