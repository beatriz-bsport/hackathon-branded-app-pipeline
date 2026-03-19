import {
  type ApiConfig,
  type Fetch,
  PaginatedResponse,
  SearchResponse,
  buildUrlParams,
} from "@bsport/store-base";

import {
  EmailTemplateCategory,
  EmailTemplateSearchResult,
  FetchEmailTemplateCategoriesParams,
  SearchEmailTemplateParams,
} from "./types";

const EMAIL_DESIGN_API_URL = "customer-data-platform/v1/email_design";
const EMAIL_DESIGN_CATEGORY_API_URL = `${EMAIL_DESIGN_API_URL}/email_design_category`;

const EMAIL_TEMPLATE_SEARCH_PAGE_SIZE = 20;
const EMAIL_TEMPLATE_CATEGORIES_DEFAULT_PAGE_SIZE = 100;

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
  fetch: Fetch<SearchResponse<EmailTemplateSearchResult>>,
  params: SearchEmailTemplateParams,
): Promise<SearchResponse<EmailTemplateSearchResult>> => {
  const [uri, init] = getSearchEmailTemplateConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};

const getFetchEmailTemplateCategoriesConfig = (
  params: FetchEmailTemplateCategoriesParams,
): ApiConfig => {
  const urlParams = buildUrlParams({
    page: params.page ?? 1,
    page_size: params.page_size ?? EMAIL_TEMPLATE_CATEGORIES_DEFAULT_PAGE_SIZE,
  });

  return [`${EMAIL_DESIGN_CATEGORY_API_URL}/${urlParams}`];
};

export const fetchEmailTemplateCategories = async ({
  fetch,
  params,
}: {
  fetch: Fetch<PaginatedResponse<EmailTemplateCategory>>;
  params: FetchEmailTemplateCategoriesParams;
}): Promise<PaginatedResponse<EmailTemplateCategory>> => {
  const [uri, init] = getFetchEmailTemplateCategoriesConfig(params);
  const { data } = await fetch(uri, init);
  return data;
};
