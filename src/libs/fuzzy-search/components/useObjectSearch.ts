import { useEffect, useState } from 'react';
import debounce from 'lodash/debounce';
import type { OptionCallback } from '#state/types';
import type {
  FuzzySearchAPIParams,
  ObjectSearchArray,
  ObjectSearchPaginated,
  SearchObjectType,
} from '#libs/fuzzy-search/types';
import { getSearchObjectURI } from '#libs/fuzzy-search/utils/getURIFromObjectType';
import { getLabelFromItem } from '#libs/fuzzy-search/utils/labelExtractor';

const DEBOUNCE_TIME = 500;

type ObjectSearchProps = {
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
  additionalParams?: Record<string, any>;
};

export const useObjectSearch = ({
  searchObjects,
  rawResults,
  searchedObjectType,
  resetSearch,

  additionalParams,
}: ObjectSearchProps) => {
  const [isLoadingFirstResults, setIsLoadingFirstResults] = useState(false);
  const [hasFetchedFirstResults, setHasFetchedFirstResults] = useState(false);

  const handleInputChange = debounce((text: string) => {
    searchObjects({
      params: {
        searchObjectURI: getSearchObjectURI(searchedObjectType),
        q: text === '' ? 'abcd' : text,
        ...additionalParams,
      },
      searchedObjectType,
    });
    setIsLoadingFirstResults(false);
  }, DEBOUNCE_TIME);

  const searchFirstResults = () => {
    if (hasFetchedFirstResults) return;
    setIsLoadingFirstResults(true);
    handleInputChange('');
    setHasFetchedFirstResults(true);
  };

  useEffect(() => {
    resetSearch(searchedObjectType);
  }, [resetSearch, searchedObjectType]);

  const formattedResults = (rawResults ?? []).map((result) => ({
    label: getLabelFromItem({
      item: result,
      searchedObjectType,
    }),
    value: result.id,
  }));

  return {
    handleInputChange,
    formattedResults,
    searchFirstResults,
    isLoadingFirstResults,
  };
};
