export type ErrorAndLoading = {
  loading: boolean;
  error?: Error;
};

export type WithPagination = {
  count: number;
  page: number;
  next_page?: number;
};

export type ModelReducerI<M = unknown> = {
  byId: { [key: string]: M };
  /**
   * We don't need to know the type for each key in generic
   * It will be dynamically typed when creating a repo
   */
  generic: { [key: string]: any };
};

export type GenericReducerI<M = unknown> = ErrorAndLoading & {
  data: M;
};

export type GenericListReducerI = ErrorAndLoading & {
  allIds: number[];
  page?: number | null;
  next_page?: number | null;
  count?: number | null;
};

export type GenericPaginationResults<T> = {
  count: number;
  next_page: number;
  links: {
    next: string;
    previous: string;
  };
  results: T[];
};
