import { queryOptions } from "@tanstack/react-query";

import {
  type Fetch,
  type PaginatedResponse,
  type SearchResponse,
} from "@bsport/store-base";

import {
  fetchEmailTemplateCategoriesAPI,
  fetchEmailTemplateDetailAPI,
  searchEmailTemplateAPI,
} from "./api";
import {
  EMAIL_TEMPLATE_CATEGORIES_DEFAULT_PAGE_SIZE,
  EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE,
  EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE_SIZE,
} from "./constants";
import { emailTemplateKeys } from "./keys";
import type { EmailTemplateCategory, EmailTemplateDetail } from "./types";

/**
 * Query options for a single email template detail by id.
 */
export const emailTemplateDetailQueryOptions = (
  fetch: Fetch<EmailTemplateDetail>,
  emailTemplateId: number,
) =>
  queryOptions({
    queryKey: emailTemplateKeys.emailTemplateDetail(emailTemplateId),
    queryFn: () => fetchEmailTemplateDetailAPI(fetch, emailTemplateId),
  });

/**
 * Query options for the paginated email template category list (first page, default page size).
 */
export const emailTemplateCategoriesQueryOptions = (
  fetch: Fetch<PaginatedResponse<EmailTemplateCategory>>,
) =>
  queryOptions({
    queryKey: emailTemplateKeys.emailTemplateCategories(),
    queryFn: () =>
      fetchEmailTemplateCategoriesAPI(fetch, {
        page: 1,
        page_size: EMAIL_TEMPLATE_CATEGORIES_DEFAULT_PAGE_SIZE,
      }),
  });

type EmailTemplateSearchQueryParams = {
  searchInput: string;
  id__in?: string;
  page?: number;
  page_size?: number;
};

/**
 * Query options for email template search (typeahead / picker).
 */
export const emailTemplateSearchQueryOptions = (
  fetch: Fetch<SearchResponse<EmailTemplateDetail>>,
  params: EmailTemplateSearchQueryParams,
) => {
  const currentPage = params.page ?? EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE;
  const currentPageSize =
    params.page_size ?? EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE_SIZE;

  return queryOptions({
    queryKey: emailTemplateKeys.emailTemplateSearchQueries(
      params.searchInput,
      params.id__in,
      currentPage,
      currentPageSize,
    ),
    queryFn: () =>
      searchEmailTemplateAPI(fetch, {
        q: params.searchInput,
        id__in: params.id__in,
        page: currentPage,
        page_size: currentPageSize,
      }),
  });
};
