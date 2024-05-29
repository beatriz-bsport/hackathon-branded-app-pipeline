import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';

import {
  objectSearchActions,
  objectSearchClientActions,
} from '#libs/fuzzy-search/actions';
import {
  IdentifiedValue,
  ObjectSearchPaginated,
  ObjectSearchResult,
  ObjectSearchState,
  SearchIdentifier,
  SearchObjectType,
  SearchState,
  searchObjectIdentifiers,
} from '#libs/fuzzy-search/types';

import { DEFAULT_SELECTOR_ID } from './constants';

type Payload<T> = { payload: T };

const defaultSelectorState: ObjectSearchState<SearchObjectType> = {
  error: null,
  loading: false,
  results: {
    next_page: null,
    page: 1,
    count: 0,
    allIds: [],
    currentResults: [],
  },
};

/**
 * initialState is a record of all the search states.
 * It is initialized with the default state for each search object type
 */

const initialState: Immutable.Immutable<SearchState> = Immutable<SearchState>({
  ...searchObjectIdentifiers.reduce<SearchState>((accumulator, objectType) => {
    accumulator[objectType] = {
      byId: {},
      // @ts-expect-error union exclusive typing
      bySelectorId: { [DEFAULT_SELECTOR_ID]: defaultSelectorState },
    };
    return accumulator;
  }, {} as SearchState),
});

export default handleActions(
  {
    [objectSearchClientActions.reset.toString()]: (
      state,
      { payload }: Payload<SearchIdentifier>,
    ) => {
      return state.merge(
        {
          [payload.searchedObjectType]: {
            bySelectorId: {
              [payload.selectorId]: defaultSelectorState,
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
        [
          payload.searchedObjectType,
          'bySelectorId',
          payload.selectorId,
          'loading',
        ],
        payload.value,
      );
    },
    [objectSearchActions.error.toString()]: (
      state,
      { payload }: Payload<IdentifiedValue<Error | null>>,
    ) => {
      return state.setIn(
        [
          payload.searchedObjectType,
          'bySelectorId',
          payload.selectorId,
          'error',
        ],
        payload.value,
      );
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
          [
            payload.searchedObjectType,
            'bySelectorId',
            payload.selectorId,
            'results',
          ],
          {
            page: payload.value.page,
            next_page: payload.value.next_page,
            currentResults: payload.value.results,
            count: payload.value.count,
            allIds:
              payload.value.page === 1
                ? newIds
                : [
                    ...state[payload.searchedObjectType].bySelectorId[
                      payload.selectorId
                    ].results.allIds.asMutable(),
                    ...newIds,
                  ],
          },
        )
        .merge(
          {
            [payload.searchedObjectType]: {
              byId: payload.value.results.reduce<
                Record<number, ObjectSearchResult>
              >((acc, currentResult) => {
                acc[currentResult.id] = currentResult;
                return acc;
              }, {}),
            },
          },
          { deep: true },
        );
    },
  },
  initialState,
);
