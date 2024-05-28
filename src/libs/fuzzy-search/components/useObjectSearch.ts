// eslint-disable-next-line bsport/no-redux-in-component
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import isEqual from 'lodash/isEqual';
import { getSearchState } from '#libs/fuzzy-search/selectors';
import { SearchObjectType, SearchState } from '#libs/fuzzy-search/types';

/**
 * Hook to access the search results when using ObjectSearch.
 * @param searchedObjectTypes - Optional array of object types to monitor for changes.
 * If not provided, the component will re-render on any change in the search store.
 * @returns
 * - getResultsById: Function to get the search results by object type.
 */

export const useObjectSearch = (searchedObjectTypes?: SearchObjectType[]) => {
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

  return { getResultsById };
};
