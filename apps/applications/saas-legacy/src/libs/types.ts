export type ErrorAndLoading = {
  loading: boolean;
  error?: Error | null;
};

export type WithPagination = {
  count: number;
  page: number;
  next_page?: number;
};

/**
 * The default params for paginated endpoints
 * @property `page_size` The number of items to retrieve in 1 page. If not provided the default viewset number will be used.
 * @property `page` The page to fetch. If not provided should fallback to page 1.
 * @example
 * export type FetchLibItemsFilterParams = PaginationFilterParams & { libProperty: string };
 * export const fetchLibItems = (params: FetchLibItemsFilterParams) => {
 *   // ...
 *   const result = await fetchLibItemsAPI({ ...params, page: params?.page ?? 1 })
 * };
 */
export type PaginationFilterParams = {
  page_size?: number;
  page?: number;
};

/**
 * A generic type to link properties between them
 * Use this type if you always want to define all-or-nothing passed props
 * @example
 * const noProps: AllOrNothing<{ a: number, b: number }> = {} // valid
 * const withProps: AllOrNothing<{ a: number, b: number }> = { a: 1, b: 2} // valid
 * const withPartialProps: AllOrNothing<{ a: number, b: number }> = { a: 1 } // invalid
 */
export type AllOrNothing<T> = T | { [K in keyof T]?: never };

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

/**
 * Used to type object that are used to store data with identifier as key
 * for example when you want to store data by Id you want to use an Object with Keys
 * Where the id of the data you fetched will be used as a key identifier
 *
 * The T generic type is used to allow you to use any data that you want with this type
 *
 * @example
 *
 * type OfferById = {
 *  91020: OfferData,
 *  56230: OfferData,
 * }
 *
 */
export type ObjectWithKeys<T> = {
  [key: number | string]: T;
};

export type AuthConnection = {
  username: string;
  is_manager: boolean;
  is_coach: boolean;
  is_consumer: boolean;
  is_franchisor: boolean;
  role: number | null;
  name: string | null;
};

export type AuthState = {
  id: number | null;
  allowed_franchisees: number[];
  authenticated: boolean;
  coaches_selected_in_role: number[];
  doubleConnexion: {
    previous: AuthConnection;
    current: AuthConnection;
  };
  email_confirmed: boolean;
  emailExists: {
    exists: boolean;
  } & ErrorAndLoading;
  emailConfirmation: {
    last_time_sent_email_confirmation: string | null;
  } & ErrorAndLoading;
  establishments_selected_in_role: number[];
  franchise_role_identifier: number;
  franchise_role: number;
  has_completed_account_configuration_on_boarding: boolean;
  has_enabled_revamped_backoffice: boolean;
  initializating: boolean;
  invalidFields: { email?: string; password?: string } | null;
  is_coach: boolean;
  is_consumer: boolean;
  is_franchisor: boolean;
  is_manager: boolean;
  lastPlatformSubscriptionDisputeWarningDate: string | null;
  lastPlatformSubscriptionWarningDate: string | null;
  lastStripeConfigurationWarningDate: string | null;
  loadingImpersonation: boolean;
  name: string;
  resetPassword: {
    last_password_reset_request: string | null;
  } & ErrorAndLoading;
  role: number;
  token: string;
  username: string;
} & ErrorAndLoading;
