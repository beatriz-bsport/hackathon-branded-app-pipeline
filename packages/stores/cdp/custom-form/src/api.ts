import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  CreateCustomFormParams,
  DisableCustomFormParams,
  DuplicateCustomFormParams,
  FetchCustomFromsStatisticsParams,
  FetchPaginatedCustomFormParams,
  FuzzySearchCustomFormParams,
  RestoreCustomFormParams,
} from "./types";

const API_URL = "customer-data-platform/v1/custom_form";

// Fetch Custom Form

export const fetchCustomFormsAPI = (
  params: FetchPaginatedCustomFormParams,
): ApiConfig => {
  return [`${API_URL}/custom_form/${buildUrlParams(params)}`];
};

export const fuzzySearchCustomFormsAPI = (
  params: FuzzySearchCustomFormParams,
): ApiConfig => {
  const { queryString, ...restParams } = params;
  return [
    `${API_URL}/custom_form/search/${buildUrlParams({ q: queryString, ...restParams })}`,
  ];
};

export const fetchCustomFormStatisticsAPI = (
  params: FetchCustomFromsStatisticsParams,
): ApiConfig => {
  return [`${API_URL}/custom_form_statistics/${buildUrlParams(params)}`];
};

// Manage Custom Form

export const createCustomFormAPI = (
  params: CreateCustomFormParams,
): ApiConfig => {
  return [
    `${API_URL}/custom_form/`,
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  ];
};

export const disableCustomFormAPI = (
  params: DisableCustomFormParams,
): ApiConfig => {
  return [
    `${API_URL}/custom_form/${params.id}/disable/`,
    {
      method: "POST",
    },
  ];
};

export const restoreCustomFormAPI = (
  params: RestoreCustomFormParams,
): ApiConfig => {
  return [
    `${API_URL}/custom_form/${params.id}/restore/`,
    {
      method: "POST",
    },
  ];
};

export const duplicateCustomFormAPI = (
  params: DuplicateCustomFormParams,
): ApiConfig => {
  return [
    `${API_URL}/custom_form/${params.id}/duplicate/`,
    {
      method: "POST",
    },
  ];
};
