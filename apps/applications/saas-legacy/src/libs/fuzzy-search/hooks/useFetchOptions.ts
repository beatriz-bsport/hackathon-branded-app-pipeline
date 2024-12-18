import { useCallback, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import type {
  ObjectSearchArray,
  ObjectSearchProps,
  SearchObjectType,
  SelectOptions,
} from '#src/libs/fuzzy-search/types';
import { getSearchObjectURI } from '#src/libs/fuzzy-search/utils/getURIFromObjectType';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectorState } from '#src/libs/fuzzy-search/selectors';
import type { RootState } from '#src/reducers';
import {
  resetObjectSearch as resetObjectSearchAction,
  searchObjects as searchObjectsAction,
} from '#src/libs/fuzzy-search/actions';
import { defaultFormatter } from '#src/libs/fuzzy-search/utils/defaultFormatter';

const DEBOUNCE_TIME = 500;

type HookProps = {
  searchedObjectType: SearchObjectType;
  additionalParams?: ObjectSearchProps['additionalParams'];
  optionsFormatter: (results: ObjectSearchArray) => SelectOptions;
  hasHydratedResults: boolean;
  selectorId: string;
  objectId?: number;
};

/**
 *
 * This hook is used to search the objects and format the resulting options.
 * It performs a first search on mount to have initial options (hydration), then
 * it debounces the search to avoid performing too many requests.
 *
 * When a change in the additionalParams is detected, it will perform a new hydration, in order to apply potential new filters.
 *
 */

export const useFetchOptions = ({
  searchedObjectType,
  additionalParams,
  hasHydratedResults,
  optionsFormatter,
  selectorId,
  objectId,
}: HookProps) => {
  const dispatch = useDispatch();

  const { rawResults } = useSelector(
    (state: RootState) => ({
      rawResults: getSelectorState(state, searchedObjectType, selectorId)
        .results.currentResults,
    }),
    isEqual,
  );
  const isLoading = useSelector(
    (state: RootState) =>
      getSelectorState(state, searchedObjectType, selectorId).loading,
  );
  const paramsRef = useRef(additionalParams);
  const compareTextRef = useRef('');
  const hydrateOptions = useCallback(() => {
    dispatch(
      searchObjectsAction({
        params: {
          searchObjectURI: getSearchObjectURI(searchedObjectType, objectId),
          q: '',
          ...additionalParams,
        },
        searchedObjectType,
        selectorId,
      }),
    );
  }, [additionalParams, dispatch, objectId, searchedObjectType, selectorId]);

  const handleInputChange = debounce((text: string) => {
    if (compareTextRef.current === text) {
      return;
    }
    compareTextRef.current = text;
    dispatch(
      searchObjectsAction({
        params: {
          searchObjectURI: getSearchObjectURI(searchedObjectType, objectId),
          q: text,
          ...additionalParams,
        },
        searchedObjectType,
        selectorId,
      }),
    );
  }, DEBOUNCE_TIME);

  useEffect(() => {
    dispatch(resetObjectSearchAction({ selectorId, searchedObjectType }));
  }, [dispatch, searchedObjectType, selectorId]);

  useEffect(() => {
    if (hasHydratedResults) {
      hydrateOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options hydration should only be performed after results hydration
  }, [hasHydratedResults]);

  if (!isEqual(paramsRef.current, additionalParams)) {
    hydrateOptions();
    paramsRef.current = additionalParams;
  }

  const mutableResults = rawResults.asMutable({ deep: true });

  const formattedResults = optionsFormatter
    ? optionsFormatter(mutableResults)
    : defaultFormatter(searchedObjectType, mutableResults);

  return {
    handleInputChange,
    formattedResults,
    isLoading,
  };
};
