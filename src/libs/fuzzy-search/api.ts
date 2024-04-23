import { buildUrlParams, getAuth } from '../../http';
import type {
  FuzzySearchAPIParams,
  ObjectSearchPaginated,
} from '#libs/fuzzy-search/types';

export const search = ({
  searchObjectURI,
  ...params
}: FuzzySearchAPIParams) => {
  const response = getAuth<ObjectSearchPaginated>(
    `${searchObjectURI}${buildUrlParams(params)}`,
  );
  return response;
};
