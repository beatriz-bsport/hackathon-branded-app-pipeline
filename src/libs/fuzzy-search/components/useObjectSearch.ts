import { useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';
import type { OptionCallback } from '#state/types';
import type {
  FuzzySearchAPIParams,
  ObjectSearchArray,
  ObjectSearchPaginated,
  ObjectSearchProps,
  ResultsMap,
  SearchObjectType,
  SelectOptions,
} from '#libs/fuzzy-search/types';
import { getSearchObjectURI } from '#libs/fuzzy-search/utils/getURIFromObjectType';
import { getLabelFromItem } from '#libs/fuzzy-search/utils/labelExtractor';

const DEBOUNCE_TIME = 500;

const defaultFormatter = <T extends SearchObjectType>(
  searchedObjectType: T,
  rawResults: ResultsMap[T]['array'],
) =>
  (rawResults ?? []).map((result: ResultsMap[T]['result']) => ({
    label: getLabelFromItem({
      item: result,
      searchedObjectType,
    }),
    value: result.id,
  }));

type HookProps = {
  searchObjects: (
    args: {
      params: FuzzySearchAPIParams;
      searchedObjectType: SearchObjectType;
    },
    options?: OptionCallback<ObjectSearchPaginated>,
  ) => Promise<void>;
  rawResults: ObjectSearchArray;
  searchedObjectType: SearchObjectType;
  resetSearch: (searchedObjectType: SearchObjectType) => void;
  additionalParams?: ObjectSearchProps['additionalParams'];
  optionsFormatter: (results: ObjectSearchArray) => SelectOptions;
  hasHydratedResults: boolean;
};

/**
 *
 * This hook is used to search the objects and format the resulting options.
 * It performs a first search on mount to have initial options (hydration), then
 * it debounces the search to avoid performing too many requests.
 *
 */

export const useObjectSearch = ({
  searchObjects,
  rawResults,
  searchedObjectType,
  resetSearch,
  additionalParams,
  hasHydratedResults,
  optionsFormatter,
}: HookProps) => {
  const hydrateOptions = useCallback(() => {
    searchObjects({
      params: {
        searchObjectURI: getSearchObjectURI(searchedObjectType),
        q: 'abcd',
        ...additionalParams,
      },
      searchedObjectType,
    });
  }, [additionalParams, searchObjects, searchedObjectType]);

  const handleInputChange = debounce((text: string) => {
    searchObjects({
      params: {
        searchObjectURI: getSearchObjectURI(searchedObjectType),
        q: text === '' ? 'abcd' : text,
        ...additionalParams,
      },
      searchedObjectType,
    });
  }, DEBOUNCE_TIME);

  useEffect(() => {
    resetSearch(searchedObjectType);
    if (hasHydratedResults) {
      hydrateOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- hydration should only be done on mount
  }, [searchedObjectType, hasHydratedResults]);

  const formattedResults = optionsFormatter
    ? optionsFormatter(rawResults)
    : defaultFormatter(searchedObjectType, rawResults);

  return {
    handleInputChange,
    formattedResults,
  };
};
