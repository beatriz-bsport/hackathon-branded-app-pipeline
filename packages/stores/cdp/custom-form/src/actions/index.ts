import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  type SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  createCustomFormAPI,
  disableCustomFormAPI,
  duplicateCustomFormAPI,
  fetchCustomFormStatisticsAPI,
  fetchCustomFormsAPI,
  fuzzySearchCustomFormsAPI,
  restoreCustomFormAPI,
} from "#src/api";
import type {
  CreateCustomFormParams,
  CustomForm,
  CustomFormStatistics,
  DisableCustomFormParams,
  DuplicateCustomFormParams,
  FetchCustomFromsStatisticsParams,
  FetchPaginatedCustomFormParams,
  FuzzySearchCustomFormParams,
  RestoreCustomFormParams,
} from "#src/types";

import { setCustomFormStatistics, setCustomForms } from "./store";

/**
 * Fetches a list of paginated custom forms.
 * @param params.page number, optional, the page number.
 * @param params.page_size number, optional, the number of items per page.
 * @param params.is_member_form boolean, optional, used to fetch only the member update form.
 * @param params.is_signup boolean, optional, , used to fetch only the member signup form.
 * @param params.disabled boolean, optional, used to choose to fetch only available or unavailable custom forms.
 * @returns A promise that resolves to an array of custom forms.
 */
export const fetchCustomFormsAction: Action<
  FetchPaginatedCustomFormParams,
  PaginatedResponse<CustomForm>
> = async (fetch, params) => {
  const [uri, init] = fetchCustomFormsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCustomForms({
        customForms: data.results,
        count: data.count,
        page: data.page,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch custom forms",
        params,
      }),
  );
};

/**
 * Search for custom forms with precise parameters.
 * @param params.queryString string, used to search for custom forms by their name.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.is_member_form boolean, optional, used to fetch only the member update form.
 * @param params.is_signup boolean, optional, , used to fetch only the member signup form.
 * @param params.disabled boolean, optional, used to choose to fetch only available or unavailable custom forms.
 * @returns A promise that resolves to an array of custom forms.
 */
export const fuzzySearchCustomFormsAction: Action<
  FuzzySearchCustomFormParams,
  SearchResponse<CustomForm>
> = async (fetch, params) => {
  const [uri, init] = fuzzySearchCustomFormsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCustomForms({
        customForms: data.results,
        count: Math.min(data.count, 20), // Design decision: Search results are limited to 20 items max
        page: 1,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch searched custom forms",
        params,
      }),
  );
};

/**
 * Fetches a list of paginated custom forms.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @returns A promise that resolves to an array of custom forms statistics.
 */
export const fetchCustomFormStatisticsAction: Action<
  FetchCustomFromsStatisticsParams,
  PaginatedResponse<CustomFormStatistics>
> = async (fetch, params) => {
  const [uri, init] = fetchCustomFormStatisticsAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setCustomFormStatistics({
        customFormStatistics: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch custom forms statistics",
        params,
      }),
  );
};

/**
 * Create a new custom form.
 * @param params.name string, the name of the custom form you want to create
 * @returns A promise that resolves to the freshly created Custom Form.
 */
export const createCustomFormAction: Action<
  CreateCustomFormParams,
  CustomForm
> = async (fetch, params) => {
  const [uri, init] = createCustomFormAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to create custom form",
        params,
      }),
  );
};

/**
 * Duplicate an existing custom form.
 * @param params.id number, the id of the custom form you want to duplicate
 * @returns A promise that resolves to the freshly created Custom Form.
 */
export const duplicateCustomFormAction: Action<
  DuplicateCustomFormParams,
  CustomForm
> = async (fetch, params) => {
  const [uri, init] = duplicateCustomFormAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to duplicate custom form",
        params,
      }),
  );
};

/**
 * Disable a custom form.
 * @param params.id number, the id of the custom form you want to disable
 * @returns A promise that resolves to a boolean telling if the operation succeeded or not.
 */
export const disableCustomFormAction: Action<
  DisableCustomFormParams,
  number
> = async (fetch, params) => {
  const [uri, init] = disableCustomFormAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);
      return params.id;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to disable custom form",
        params,
      }),
  );
};

/**
 * Restore a custom form.
 * @param params.id number, the id of the custom form you want to restore
 * @returns A promise that resolves to a boolean telling if the operation succeeded or not.
 */
export const restoreCustomFormAction: Action<
  RestoreCustomFormParams,
  number
> = async (fetch, params) => {
  const [uri, init] = restoreCustomFormAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      return params.id;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to restore custom form",
        params,
      }),
  );
};
