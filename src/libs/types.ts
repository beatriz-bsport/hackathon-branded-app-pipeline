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
    next: string | number;
    previous: string | number;
  };
  results: T[];
};

export type Period = {
  start: string;
  end: string;
};

export enum UserInteractionKey {
  ENTER = 'Enter',
  ESCAPE = 'Escape',
  SPACE = ' ',
}

/**
 * Generates a type from 2 input types with
 * common properties only
 *
 * @example
 * type A = {
 *   id: number;
 *   name: string;
 *   description: string;
 * }
 *
 * type B = {
 *   name: string;
 *   price: string;
 *   description: string;
 * }
 *
 * type C = Common<A, B> // { name: string; description: string; }
 */
export type Common<A, B> = {
  [P in keyof A & keyof B]: A[P] | B[P];
};

export type SelectOption<T = string> = {
  label: string;
  value: T;
};
