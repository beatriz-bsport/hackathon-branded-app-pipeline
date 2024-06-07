import { useCallback, useEffect, useState } from 'react';
import { getSearchObjectURI } from '#src/libs/fuzzy-search/utils/getURIFromObjectType';
import { getLabelFromItem } from '#src/libs/fuzzy-search/utils/labelExtractor';
import { useDispatch, useSelector } from 'react-redux';
import { getResultsById } from '#src/libs/fuzzy-search/selectors';
import isEqual from 'lodash/isEqual';
import { searchObjects as searchObjectsAction } from '#src/libs/fuzzy-search/actions';
import type { RootState } from '#src/reducers';
import type { SearchObjectType } from '#src/libs/fuzzy-search/types';

type HookProps = {
  searchedObjectType: SearchObjectType;
  valuesToHydrate?: number[];
  selectorId: string;
  objectId: number;
};

/**
 *
 * This hook is used to load the search results with the initial values given.
 * @param searchedObjectType: The type of object that is being searched
 * @param initialValues: The initial values that need to be hydrated
 * @returns formattedInitialValues: The initial values that are obtained post-hydration
 * @returns hasHydratedResults: A boolean that indicates if the initial values have been hydrated
 *
 */
export const useHydrateSearch = ({
  searchedObjectType,
  selectorId,
  objectId,
  valuesToHydrate,
}: HookProps) => {
  const dispatch = useDispatch();
  const { resultsById } = useSelector(
    (state: RootState) => ({
      resultsById: getResultsById(state, searchedObjectType),
    }),
    isEqual,
  );
  const [hasHydratedResults, setHasHydratedResults] = useState(
    !valuesToHydrate?.length,
  );
  const hydrateInitialValues = useCallback(() => {
    dispatch(
      searchObjectsAction(
        {
          params: {
            searchObjectURI: getSearchObjectURI(searchedObjectType, objectId),
            q: '',
            id__in: valuesToHydrate ?? [],
          },
          searchedObjectType,
          selectorId,
        },
        { onSuccess: () => setHasHydratedResults(true) },
      ),
    );
  }, [dispatch, objectId, searchedObjectType, selectorId, valuesToHydrate]);

  useEffect(() => {
    if (!hasHydratedResults) {
      hydrateInitialValues();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formattedInitialValues = (valuesToHydrate ?? [])
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
