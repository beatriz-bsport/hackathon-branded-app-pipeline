import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  IdentifiedValue,
  objectSearchActions,
  objectSearchClientActions,
} from '#libs/fuzzy-search/actions';
import {
  ObjectSearchPaginated,
  ObjectSearchResult,
  ObjectSearchState,
  SearchObjectType,
  SearchState,
  searchObjectIdentifiers,
} from '#libs/fuzzy-search/types';

type Payload<T> = { payload: T };

const getDefaultState = (): ObjectSearchState<SearchObjectType> => ({
  error: null,
  isLoading: false,
  results: {
    page: 0,
    count: 0,
    allIds: [],
    currentResults: [],
    byId: {},
  },
});

/**
 * initialState is a record of all the search states.
 * It is initialized with the default state for each search object type
 */

const initialState: Immutable.Immutable<SearchState> = Immutable<SearchState>({
  ...searchObjectIdentifiers.reduce<SearchState>((accumulator, objectType) => {
    // @ts-expect-error hard exclusive typing
    accumulator[objectType] = getDefaultState();
    return accumulator;
  }, {} as SearchState),
});

export default handleActions(
  {
    [objectSearchClientActions.reset.toString()]: (
      state,
      { payload }: Payload<any>, // Payload<SearchObjectType> but redux typing -_-
    ) => {
      return state.merge(
        {
          [payload]: {
            error: null,
            isLoading: false,
            results: {
              page: 0,
              count: 0,
              currentResults: [], // not resetting allIds and byId because those could be used to display initial values
            },
          },
        },
        { deep: true },
      );
    },

    [objectSearchActions.isLoading.toString()]: (
      state,
      { payload }: Payload<IdentifiedValue<boolean>>,
    ) => {
      return state.setIn(
        [payload.searchObjectType, 'isLoading'],
        payload.value,
      );
    },
    [objectSearchActions.error.toString()]: (
      state,
      { payload }: Payload<IdentifiedValue<Error>>,
    ) => {
      return state.setIn([payload.searchObjectType, 'error'], payload.value);
    },
    [objectSearchActions.success.toString()]: (
      state,
      { payload }: Payload<IdentifiedValue<ObjectSearchPaginated>>,
    ) => {
      const newIds: number[] = payload.value.results.map(
        (object: ObjectSearchResult) => object.id,
      );

      return state
        .setIn(
          [payload.searchObjectType, 'results', 'page'],
          payload.value.page,
        )
        .setIn(
          [payload.searchObjectType, 'results', 'next_page'],
          payload.value.next_page,
        )
        .setIn(
          [payload.searchObjectType, 'results', 'currentResults'],
          payload.value.results,
        )
        .setIn(
          [payload.searchObjectType, 'results', 'count'],
          payload.value.count,
        )
        .setIn(
          [payload.searchObjectType, 'results', 'allIds'],
          payload.value.page === 1
            ? newIds
            : [
                ...state[payload.searchObjectType].results.allIds.asMutable(),
                ...newIds,
              ],
        )
        .merge(
          {
            [payload.searchObjectType]: {
              results: {
                byId: payload.value.results.reduce(
                  (
                    acc: Record<number, ObjectSearchResult>,
                    currentResult: ObjectSearchResult,
                  ) => {
                    acc[currentResult.id] = currentResult;
                    return acc;
                  },
                  {},
                ),
              },
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
