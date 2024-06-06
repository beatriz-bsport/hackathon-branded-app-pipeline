// eslint-disable-next-line bsport/no-redux-in-component
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { getSearchState } from '#src/libs/fuzzy-search/selectors';
import {
  FuzzySearchFilterParams,
  SearchObjectType,
  SearchState,
} from '#src/libs/fuzzy-search/types';
import { searchObjects as searchObjectsAction } from '../actions';
import { getSearchObjectURI } from '../utils/getURIFromObjectType';
import { DEFAULT_SELECTOR_ID } from '../constants';

/**
 * Hook to access the actions related to ObjectSearch.
 * @param searchedObjectTypes - Optional array of object types to monitor for changes.
 * If not provided, the component will re-render on any change in the search store.
 * @returns
 * - `getResultsById`: Function to get the search results by id for a given object type.
 * - `refreshOptions`: Function to refresh the search results for a given object type.
 * - `getSelectorState`: Function to get the search state for a given object type.
 */

export const useObjectSearch = (searchedObjectTypes?: SearchObjectType[]) => {
  const dispatch = useDispatch();
  const comparisonFn = useCallback(
    (prev: SearchState, next: SearchState) => {
      if (!searchedObjectTypes) return Object.is(prev, next);
      return searchedObjectTypes.every((type) =>
        isEqual(prev[type], next[type]),
      );
    },
    [searchedObjectTypes],
  );
  const searchResults = useSelector(getSearchState, comparisonFn);

  const getResultsById = useCallback(
    <T extends SearchObjectType>(searchObjectType: T) => {
      return searchResults[searchObjectType].byId;
    },
    [searchResults],
  );

  const refreshOptions = <T extends SearchObjectType>(
    searchedObjectType: T,
    additionalParams?: FuzzySearchFilterParams<T>,
    selectorId = DEFAULT_SELECTOR_ID,
    objectId?: number,
  ) => {
    searchObjectsAction({
      params: {
        searchObjectURI: getSearchObjectURI(searchedObjectType, objectId),
        q: '',
        ...(additionalParams ?? {}),
      },
      searchedObjectType,
      selectorId,
    })(dispatch);
  };

  const getSelectorState = <T extends SearchObjectType>(
    searchedObjectType: T,
    selectorId = DEFAULT_SELECTOR_ID,
  ) => searchResults[searchedObjectType].bySelectorId[selectorId];

  return { getSelectorState, getResultsById, refreshOptions };
};
