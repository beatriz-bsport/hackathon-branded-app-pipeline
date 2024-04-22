import { API_V1_URI, buildUrlParams, getAuth } from '../../http';
import type {
  FuzzySearchAPIParams,
  ObjectSearchPaginated,
} from '#libs/fuzzy-search/types';

export const search = ({
  searchObjectURI,
  ...params
}: FuzzySearchAPIParams) => {
  const response = getAuth<ObjectSearchPaginated>(
    `${API_V1_URI}/${searchObjectURI}/search/${buildUrlParams(params)}`,
  );
  return response;
};
