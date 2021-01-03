// @flow
/* eslint-disable */
import { createAction, handleActions } from 'redux-actions';

import type { Dispatch, Action, State } from '../state/types';

export function createListHandler(
  objectName: string,
  listEndpoint: *,
  fetchFromEndpoint: *,
) {
  const listActions = {
    isLoading: createAction(`${objectName.toUpperCase()}/LIST/IS_LOADING`),
    fetchedPage: createAction(`${objectName.toUpperCase()}/ALL/FETCHED_PAGE`),
    reset: createAction(`${objectName.toUpperCase()}/ALL/RESET`),
    error: createAction(`${objectName.toUpperCase()}/ALL/ERROR`),
  };

  function fetcher() {
    return async (dispatch: Dispatch) => {
      dispatch(listActions.isLoading(true));
      dispatch(listActions.reset());
      let next = 1;

      try {
        while (next) {
          // eslint-disable-next-line
          const response = await listEndpoint({ page: next });
          const { results } = response.data;
          next = response.data.next_page;
          dispatch(listActions.fetchedPage(results));
        }
      } catch (err) {
        console.error(err);
        dispatch(listActions.error(err));
      }
      dispatch(listActions.isLoading(false));
    };
  }

  function refresher() {
    return async (dispatch: Dispatch, getState: () => State) => {
      const { loading, all } = getState()[objectName];
      if (loading || !all.length) {
        return;
      }

      // dispatch(listActions.isLoading(true));
      let next = 1;
      try {
        while (next) {
          // eslint-disable-next-line
          const response = await fetchFromEndpoint(
            all[all.length - 1].id,
            next,
          );
          const { results, next_page } = response.data;
          dispatch(listActions.fetchedPage(results));
          next = next_page;
        }
      } catch (err) {
        console.error(err);
        dispatch(listActions.error(err));
      }
      dispatch(listActions.isLoading(false));
    };
  }

  const listReducers = (initialState: State, action: Action) =>
    handleActions(
      {
        [listActions.reset]: (state) => {
          return state.set('all', []).set('error', null);
        },
        [listActions.isLoading]: (state, { payload }) => {
          return state.set('loading', payload);
        },
        [listActions.error]: (state, { payload }) => {
          return state.set('error', payload);
        },
        [listActions.fetchedPage]: (state, { payload }) => {
          if ((payload || []).length) {
            return state.set('all', state.all.concat(payload));
          }
          return state;
        },
      },
      initialState,
    )(initialState, action);

  return { fetcher, refresher, listActions, listReducers };
}

export function createDictionnaryById(data: Array<any>) {
  return data.reduce((map, obj) => {
    const newMap = map;
    newMap[obj.id] = obj;
    return newMap;
  }, {});
}

export function createIdList(data: Array<any>) {
  return data.map((object) => object.id);
}
