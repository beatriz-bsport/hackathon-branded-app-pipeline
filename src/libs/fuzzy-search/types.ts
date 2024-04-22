import type { CoachPaymentRule } from '#libs/coach-payment-rules/types';
import type { Coupon, FetchCouponsParams } from '#libs/coupon/types';
import type { PaginatedResponse } from '#state/types';

export type ObjectSearchResult = ResultsMap[SearchObjectType]['result'];
export type ObjectSearchArray = ResultsMap[SearchObjectType]['array'];
export type ObjectSearchPaginated = ResultsMap[SearchObjectType]['paginated'];

export type ObjectSearchState<T extends SearchObjectType> = {
  error: Error | null;
  isLoading: boolean;
  results: {
    currentResults: ResultsMap[T]['array'];
    page: number;
    count: number;
    byId: Record<number, ResultsMap[T]['result']>;
    allIds: number[];
  };
};

export type SearchState = {
  [key in SearchObjectType]: ObjectSearchState<key>;
};

/**
 * Add your new object identifier here
 */

export const searchObjectIdentifiers = [
  'coach_payment_rules',
  'coupon',
] as const;

export type SearchObjectType = (typeof searchObjectIdentifiers)[number];

/**
 * Identifies the type of the returned objects
 */

type ResultsTypes = {
  coach_payment_rules: CoachPaymentRule;
  coupon: Coupon;
};

type ResultTypeMap<T extends SearchObjectType> = {
  result: ResultsTypes[T];
  array: ResultsTypes[T][];
  paginated: PaginatedResponse<ResultsTypes[T]>;
  full: PaginatedResponse<ResultsTypes[T]> & { searchedObjectType: T };
};
export type ResultsMap = { [key in SearchObjectType]: ResultTypeMap<key> };

/**
 * The different props that can be passed to the ObjectSearch component depending on the searched object
 */

export type ObjectSearchProps = {
  [key in SearchObjectType]: {
    searchedObjectType: key;
    additionalParams?: CommonParams & APIParamsMap[key];
  };
}[SearchObjectType];

/**
 * The Query params that can be given to the API depending on the object you are searching for
 */

type APIParamsMap = {
  coach_payment_rules: CoachPaymentRuleAPIParams;
  coupon: CouponAPIParams;
};

export type FuzzySearchAPIParams = APIParamsMap[SearchObjectType] & {
  searchObjectURI: string;
  q: string;
};

type CommonParams = {
  page_size?: number;
  page?: number;
};

type CoachPaymentRuleAPIParams = CommonParams;

type CouponAPIParams = CommonParams & FetchCouponsParams;

/**
 * The API contract for each type of object you are searching
 */
