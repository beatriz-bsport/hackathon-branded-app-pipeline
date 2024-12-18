import type {
  ResultsMap,
  SearchObjectType,
} from '#src/libs/fuzzy-search/types';
import { getLabelFromItem } from '#src/libs/fuzzy-search/utils/labelExtractor';

export const defaultFormatter = <T extends SearchObjectType>(
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
