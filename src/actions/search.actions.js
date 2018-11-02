// @flow

import { push, replace, goBack, go } from 'react-router-redux';

import { fetchMember } from './member.actions';
import { fetchBookingsByMember } from './booking.actions';

import types from './search.types';

export function actionSearchTextStart(text: string, path: string) {
  return { type: types.SEARCH_TEXT_START, text, path };
}

export function actionSearchTextSuccess(response) {
  return { type: types.SEARCH_TEXT_SUCCESS, response };
}

export function actionSearchTextError(error) {
  return { type: types.SEARCH_TEXT_ERROR, error };
}

export function searchText(text: string, path: string) {
  return async (dispatch) => {
    dispatch(actionSearchTextStart(text, path));

    try {
      const mustPush = path === '/search/results';
      const updateHistory = mustPush ? push : replace;
      dispatch(updateHistory(`/search/results?q=${encodeURIComponent(text)}`));
      // const response = await search.forUsers(text);
      // dispatch(actionSearchTextSuccess(response));
    } catch (error) {
      dispatch(actionSearchTextError(error));
    }
  };
}

export function clearSearch() {
  return async (dispatch, getState) => {
    dispatch(searchText('', null));
    dispatch(push(getState().search.path));
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
