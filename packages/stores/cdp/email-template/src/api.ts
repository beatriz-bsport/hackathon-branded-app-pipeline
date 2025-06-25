import { type ApiConfig, buildUrlParams } from "@bsport/store-base";

import type {
  CompanyTemplateFilters,
  CreateEmailTemplateCategoryPayload,
  CreateEmailTemplatePayload,
  DeleteEmailTemplateCategoryPayload,
  DeleteEmailTemplatePayload,
  EditEmailTemplatePayload,
  FetchEmailTemplateCategoriesParams,
  FetchEmailTemplateSummaryParams,
  SearchEmailTemplateParams,
  UpdateCategoryOrderingPayload,
  UpdateEmailTemplateCategoryPayload,
  UpdateTemplateOrderingPayload,
} from "./types";

const API_URL = "customer-data-platform/v1/email_design";

// ----- Email Templates Summary API -----

export const fetchEmailTemplatesAPI = (
  params: FetchEmailTemplateSummaryParams,
): ApiConfig => {
  return [`${API_URL}/summary_paginated/${buildUrlParams(params)}`];
};

export const fetchAllEmailTemplatesAPI = (
  params: CompanyTemplateFilters,
): ApiConfig => {
  return [`${API_URL}/summary/${buildUrlParams(params)}`];
};

export const searchEmailTemplatesAPI = (
  params: SearchEmailTemplateParams,
): ApiConfig => {
  const { queryString, ...otherParams } = params;
  return [
    `${API_URL}/search/${buildUrlParams({ ...otherParams, q: queryString ?? "" })}`,
  ];
};

export const updateEmailTemplateOrderingAPI = (
  params: UpdateTemplateOrderingPayload,
): ApiConfig => {
  return [
    `${API_URL}/set_multiple_order/`,
    { method: "PATCH", body: JSON.stringify(params) },
  ];
};

// ----- Email Templates Category API -----

export const fetchEmailTemplateCategoriesAPI = (
  params: FetchEmailTemplateCategoriesParams,
): ApiConfig => {
  return [`${API_URL}/email_design_category/${buildUrlParams(params)}`];
};

export const createEmailTemplateCategoryAPI = (
  payload: CreateEmailTemplateCategoryPayload,
): ApiConfig => {
  return [
    `${API_URL}/email_design_category/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
};

export const updateEmailTemplateCategoryAPI = (
  payload: UpdateEmailTemplateCategoryPayload,
): ApiConfig => {
  return [
    `${API_URL}/email_design_category/${payload.id}/`,
    { method: "PUT", body: JSON.stringify(payload) },
  ];
};

export const deleteEmailTemplateCategoryAPI = (
  params: DeleteEmailTemplateCategoryPayload,
): ApiConfig => {
  return [
    `${API_URL}/email_design_category/${params.id}`,
    { method: "DELETE" },
  ];
};

export const updateCategoryOrderingAPI = (
  params: UpdateCategoryOrderingPayload,
): ApiConfig => {
  return [
    `${API_URL}/email_design_category/set_order/`,
    { method: "PATCH", body: JSON.stringify(params) },
  ];
};

// ----- Email Templates Detail API -----

export const fetchEmailTemplateDetailAPI = (id: number): ApiConfig => {
  return [`${API_URL}/${id}`];
};

export const createEmailTemplateAPI = (
  payload: CreateEmailTemplatePayload,
): ApiConfig => {
  return [`${API_URL}/`, { method: "POST", body: JSON.stringify(payload) }];
};

export const updateEmailTemplateAPI = ({
  id,
  ...payload
}: EditEmailTemplatePayload): ApiConfig => {
  return [
    `${API_URL}/${id}/`,
    { method: "PATCH", body: JSON.stringify(payload) },
  ];
};

export const deleteEmailTemplateAPI = (
  params: DeleteEmailTemplatePayload,
): ApiConfig => {
  return [`${API_URL}/${params.id}`, { method: "DELETE" }];
};
