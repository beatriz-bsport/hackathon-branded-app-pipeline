import { useCallback, useEffect, useState } from 'react';
import type { OptionCallback } from '#src/state/types';
import {
  FuzzySearchAPIParams,
  ObjectSearchPaginated,
  ObjectSearchResult,
  SearchObjectType,
} from '#src/libs/fuzzy-search/types';
import { getSearchObjectURI } from '#src/libs/fuzzy-search/utils/getURIFromObjectType';
import { getLabelFromItem } from '#src/libs/fuzzy-search/utils/labelExtractor';

type HookProps = {
  searchedObjectType: SearchObjectType;
  initialValues?: number[];
  resultsById: Record<number, ObjectSearchResult>;
  selectorId: string;
  searchObjects: (
    args: {
      params: FuzzySearchAPIParams;
      searchedObjectType: SearchObjectType;
      selectorId: string;
    },
    options?: OptionCallback<ObjectSearchPaginated>,
  ) => Promise<void>;
};

/**
 *
 * This hook is used to load the search results with the initial values given.
 * @param searchedObjectType: The type of object that is being searched
 * @param initialValues: The initial values that need to be hydrated
 * @param resultsById: The search results that are present in the store
 * @param searchObjects: The function that is used to search the objects
 * @returns formattedInitialValues: The initial values that are obtained post-hydration
 * @returns hasHydratedResults: A boolean that indicates if the initial values have been hydrated
 *
 */
export const useHydrateSearch = ({
  searchObjects,
  searchedObjectType,
  resultsById,
  initialValues,
  selectorId,
}: HookProps) => {
  const [hasHydratedResults, setHasHydratedResults] = useState(
    !initialValues?.length,
  );
  const hydrateInitialValues = useCallback(() => {
    searchObjects(
      {
        params: {
          searchObjectURI: getSearchObjectURI(searchedObjectType),
          q: '',
          id__in: initialValues ?? [],
        },
        searchedObjectType,
        selectorId,
      },
      { onSuccess: () => setHasHydratedResults(true) },
    );
  }, [initialValues, searchObjects, searchedObjectType, selectorId]);

  useEffect(() => {
    if (!hasHydratedResults) {
      hydrateInitialValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedInitialValues = (initialValues ?? [])
    .map((id) => {
      if (resultsById?.[id]) {
        return {
          label: getLabelFromItem({
            item: resultsById[id],
            searchedObjectType,
          }),
          value: id,
        };
      }
      return undefined;
    })
    .filter((item) => !!item);

  return { formattedInitialValues, hasHydratedResults };
};
