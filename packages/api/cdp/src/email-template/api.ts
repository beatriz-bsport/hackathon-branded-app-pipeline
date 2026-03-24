import {
  type ApiConfig,
  type Fetch,
  PaginatedResponse,
  SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import {
  type CategoryOrderingData,
  type CreateEmailTemplateCategoryPayload,
  type CreateEmailTemplatePayload,
  type DeleteEmailTemplateCategoryPayload,
  type DeleteEmailTemplatePayload,
  type EditEmailTemplatePayload,
  EmailTemplateCategory,
  EmailTemplateDetail,
  EmailTemplateSummary,
  FetchEmailTemplateCategoriesParams,
  FetchEmailTemplateSummaryParams,
  SearchEmailTemplateParams,
  type UpdateCategoryOrderingPayload,
  type UpdateEmailTemplateCategoryPayload,
  type UpdateTemplateOrderingPayload,
} from "./types";

const EMAIL_DESIGN_API_URL = "customer-data-platform/v1/email_design";
const EMAIL_DESIGN_CATEGORY_API_URL = `${EMAIL_DESIGN_API_URL}/email_design_category`;

const EMAIL_TEMPLATE_SEARCH_PAGE_SIZE = 20;
const EMAIL_TEMPLATE_CATEGORIES_DEFAULT_PAGE_SIZE = 100;

// ----- Search -----

const getSearchEmailTemplateConfig = (
  params: SearchEmailTemplateParams,
): ApiConfig => {
  const urlParams = buildUrlParams({
    q: params.q ?? "",
    id__in: params.id__in ?? "",
    page: params.page ?? 1,
    page_size: params.page_size ?? EMAIL_TEMPLATE_SEARCH_PAGE_SIZE,
  });

  return [`${EMAIL_DESIGN_API_URL}/search/${urlParams}`];
};

export const searchEmailTemplate = async (
  fetch: Fetch<SearchResponse<EmailTemplateDetail>>,
  params: SearchEmailTemplateParams,
): Promise<SearchResponse<EmailTemplateDetail>> => {
  const [uri, init] = getSearchEmailTemplateConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

// ----- Summary (paginated & all) -----

const getFetchEmailTemplateSummariesConfig = (
  params: FetchEmailTemplateSummaryParams,
): ApiConfig => {
  const urlParams = buildUrlParams(params);
  return [`${EMAIL_DESIGN_API_URL}/summary_paginated/${urlParams}`];
};

export const fetchEmailTemplateSummaries = async (
  fetch: Fetch<PaginatedResponse<EmailTemplateSummary>>,
  params: FetchEmailTemplateSummaryParams,
): Promise<PaginatedResponse<EmailTemplateSummary>> => {
  const [uri, init] = getFetchEmailTemplateSummariesConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

const getFetchAllEmailTemplateSummariesConfig = (
  params: FetchEmailTemplateSummaryParams,
): ApiConfig => {
  const urlParams = buildUrlParams(params);
  return [`${EMAIL_DESIGN_API_URL}/summary/${urlParams}`];
};

export const fetchAllEmailTemplateSummaries = async (
  fetch: Fetch<EmailTemplateSummary[]>,
  params: FetchEmailTemplateSummaryParams,
): Promise<EmailTemplateSummary[]> => {
  const [uri, init] = getFetchAllEmailTemplateSummariesConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

// ----- Categories -----

const getFetchEmailTemplateCategoriesConfig = (
  params: FetchEmailTemplateCategoriesParams,
): ApiConfig => {
  const urlParams = buildUrlParams({
    page: params.page ?? 1,
    page_size: params.page_size ?? EMAIL_TEMPLATE_CATEGORIES_DEFAULT_PAGE_SIZE,
    ...(params.company != null && { company: params.company }),
    ...(params.ordering != null && { ordering: params.ordering }),
  });

  return [`${EMAIL_DESIGN_CATEGORY_API_URL}/${urlParams}`];
};

export const fetchEmailTemplateCategories = async (
  fetch: Fetch<PaginatedResponse<EmailTemplateCategory>>,
  params: FetchEmailTemplateCategoriesParams,
): Promise<PaginatedResponse<EmailTemplateCategory>> => {
  const [uri, init] = getFetchEmailTemplateCategoriesConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

export const createEmailTemplateCategory = async (
  fetch: Fetch<EmailTemplateCategory>,
  payload: CreateEmailTemplateCategoryPayload,
): Promise<EmailTemplateCategory> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_CATEGORY_API_URL}/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

export const updateEmailTemplateCategory = async (
  fetch: Fetch<EmailTemplateCategory>,
  payload: UpdateEmailTemplateCategoryPayload,
): Promise<EmailTemplateCategory> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_CATEGORY_API_URL}/${payload.id}/`,
    { method: "PUT", body: JSON.stringify(payload) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

export const deleteEmailTemplateCategory = async (
  fetch: Fetch<void>,
  params: DeleteEmailTemplateCategoryPayload,
): Promise<void> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_CATEGORY_API_URL}/${params.id}`,
    { method: "DELETE" },
  ];
  await fetch(uri, init);
};

export const updateCategoryOrdering = async (
  fetch: Fetch<CategoryOrderingData[]>,
  payload: UpdateCategoryOrderingPayload,
): Promise<CategoryOrderingData[]> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_API_URL}/email_design_category/set_order/`,
    { method: "PATCH", body: JSON.stringify(payload) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

// ----- Template detail -----

export const fetchEmailTemplateDetail = async (
  fetch: Fetch<EmailTemplateDetail>,
  id: number,
): Promise<EmailTemplateDetail> => {
  const [uri, init] = [`${EMAIL_DESIGN_API_URL}/${id}`, {}];
  const { data } = await fetch(uri, init);
  return data;
};

export const createEmailTemplate = async (
  fetch: Fetch<EmailTemplateDetail>,
  payload: CreateEmailTemplatePayload,
): Promise<EmailTemplateDetail> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_API_URL}/`,
    { method: "POST", body: JSON.stringify(payload) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

export const updateEmailTemplate = async (
  fetch: Fetch<EmailTemplateDetail>,
  payload: EditEmailTemplatePayload,
): Promise<EmailTemplateDetail> => {
  const { id, ...body } = payload;
  const [uri, init] = [
    `${EMAIL_DESIGN_API_URL}/${id}/`,
    { method: "PATCH", body: JSON.stringify(body) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};

export const deleteEmailTemplate = async (
  fetch: Fetch<void>,
  params: DeleteEmailTemplatePayload,
): Promise<void> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_API_URL}/${params.id}`,
    { method: "DELETE" },
  ];
  await fetch(uri, init);
};

export const updateEmailTemplateOrdering = async (
  fetch: Fetch<UpdateTemplateOrderingPayload>,
  payload: UpdateTemplateOrderingPayload,
): Promise<UpdateTemplateOrderingPayload> => {
  const [uri, init] = [
    `${EMAIL_DESIGN_API_URL}/set_multiple_order/`,
    { method: "PATCH", body: JSON.stringify(payload) },
  ];
  const { data } = await fetch(uri, init);
  return data;
};
