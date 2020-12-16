// @flow

import { push, replace } from 'connected-react-router';

import { search as searchMember } from '../libs/member/actions';
import type { State, Dispatch } from '../state/types.ts';

import types from './search.types';

export function actionSearchTextStart(
  text: string,
  path: string,
  changeLocation: boolean,
) {
  const path_ = changeLocation ? path : null;
  return { type: types.SEARCH_TEXT_START, text, path_ };
}

export function actionSearchTextSuccess(response: Response) {
  return { type: types.SEARCH_TEXT_SUCCESS, response };
}

export function actionSearchTextError(error: ?Error) {
  return { type: types.SEARCH_TEXT_ERROR, error };
}

export function searchText(
  text: string,
  path: string,
  changeLocation: boolean,
) {
  return async (dispatch: Dispatch) => {
    dispatch(actionSearchTextStart(text, path, changeLocation));
    dispatch(actionSearchTextError(null));
    if (changeLocation) {
      try {
        const mustPush = path !== '/search/results';
        const goto = mustPush ? push : replace;
        dispatch(goto(`/search/results?q=${encodeURIComponent(text)}`));
        dispatch(searchMember(text));
      } catch (error) {
        dispatch(actionSearchTextError(error));
      }
    }
  };
}

export function clearSearch(changeLocation: boolean) {
  return async (dispatch: Dispatch, getState: () => State) => {
    if (changeLocation) {
      dispatch(push(getState().search.path));
    }
  };
}

export function actionSearchSelectEntityStart(entity: any) {
  return { type: types.SEARCH_SELECT_ENTITY_START, entity };
}

export function actionSearchSelectEntitySuccess(response: Response) {
  return { type: types.SEARCH_SELECT_ENTITY_SUCCESS, response };
}

export function actionSearchSelectEntityError(error: ?Error) {
  return { type: types.SEARCH_SELECT_ENTITY_ERROR, error };
}

export function selectEntity(entity: any) {
  return async (dispatch: Dispatch) => {
    dispatch(actionSearchSelectEntityStart(entity));
    dispatch(actionSearchSelectEntityError(null));

    try {
      // if (entity) {
      //   dispatch(fetchMember(entity.data.id));
      // }
      // dispatch( actionSearchSelectEntitySuccess({ }));
    } catch (error) {
      dispatch(actionSearchSelectEntityError(error));
    }
  };
}
