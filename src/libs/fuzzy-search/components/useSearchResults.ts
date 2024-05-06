// eslint-disable-next-line
import { useSelector } from 'react-redux';
import { getSearchState } from '#libs/fuzzy-search/selectors';
import { SearchObjectType, SearchState } from '#libs/fuzzy-search/types';

/**
 * Hook to access the search results when using ObjectSearch.
 * @param searchedObjectTypes - Optional array of object types to monitor for changes.
 * If not provided, the component will re-render on any change in the search store.
 * It is not much of a problem, as the state can only be updated by the search reducer.
 * @returns SearchState
 */
export const useSearchResults = (searchedObjectTypes?: SearchObjectType[]) => {
  const comparisonFn = (prev: SearchState, next: SearchState) => {
    return searchedObjectTypes.every((type) => prev[type] === next[type]);
  };
  const searchResults = useSelector(
    getSearchState,
    searchedObjectTypes ? comparisonFn : undefined,
  );

  return searchResults;
};
