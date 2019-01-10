// @flow

import { push, replace } from 'connected-react-router';

import { fetchMember } from './member.actions';
import { fetchBookingsByMember } from './booking.actions';

import types from './search.types';

export function actionSearchTextStart(text, path, changeLocation) {
  const path_ = changeLocation ? path : null;
  return { type: types.SEARCH_TEXT_START, text, path_ };
}

export function actionSearchTextSuccess(response) {
  return { type: types.SEARCH_TEXT_SUCCESS, response };
}

export function actionSearchTextError(error) {
  return { type: types.SEARCH_TEXT_ERROR, error };
}

export function searchText(text, path, changeLocation) {
  return async (dispatch) => {
    dispatch(actionSearchTextStart(text, path, changeLocation));
    if (changeLocation) {
      try {
        const mustPush = path !== '/search/results';
        const goto = mustPush ? push : replace;
        dispatch(goto(`/search/results?q=${encodeURIComponent(text)}`));
      } catch (error) {
        dispatch(actionSearchTextError(error));
      }
    }
  };
}

export function clearSearch(changeLocation) {
  return async (dispatch, getState) => {
    if (changeLocation) {
      dispatch(push(getState().search.path));
    }
  };
}

export function actionSearchSelectEntityStart(entity) {
  return { type: types.SEARCH_SELECT_ENTITY_START, entity };
}

export function actionSearchSelectEntitySuccess(response) {
  return { type: types.SEARCH_SELECT_ENTITY_SUCCESS, response };
}

export function actionSearchSelectEntityError(error) {
  return { type: types.SEARCH_SELECT_ENTITY_ERROR, error };
}

export function selectEntity(entity) {
  return async (dispatch) => {
    dispatch(actionSearchSelectEntityStart(entity));

    try {
      if (entity) {
        dispatch(fetchMember(entity.data.id));
        dispatch(fetchBookingsByMember(entity.data.id));
      }
      // dispatch( actionSearchSelectEntitySuccess({ }));
    } catch (error) {
      dispatch(actionSearchSelectEntityError(error));
    }
  };
}
