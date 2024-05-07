import { useCallback, useEffect, useState } from 'react';
import type { OptionCallback } from '#state/types';
import {
  FuzzySearchAPIParams,
  ObjectSearchPaginated,
  ObjectSearchResult,
  SearchObjectType,
} from '#libs/fuzzy-search/types';
import { getSearchObjectURI } from '#libs/fuzzy-search/utils/getURIFromObjectType';
import { getLabelFromItem } from '#libs/fuzzy-search/utils/labelExtractor';

type HookProps = {
  searchedObjectType: SearchObjectType;
  initialValues?: number[];
  resultsById: Record<number, ObjectSearchResult>;
  searchObjects: (
    args: {
      params: FuzzySearchAPIParams;
      searchedObjectType: SearchObjectType;
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
}: HookProps) => {
  const [hasHydratedResults, setHasHydratedResults] = useState(
    !initialValues?.length,
  );
  const hydrateInitialValues = useCallback(() => {
    searchObjects(
      {
        params: {
          searchObjectURI: getSearchObjectURI(searchedObjectType),
          q: 'abcd',
          id__in: initialValues ?? [],
        },
        searchedObjectType,
      },
      { onSuccess: () => setHasHydratedResults(true) },
    );
  }, [initialValues, searchObjects, searchedObjectType]);

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
