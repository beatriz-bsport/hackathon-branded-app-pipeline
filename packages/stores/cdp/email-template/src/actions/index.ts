import { Result } from "typescript-result";

import {
  type Action,
  type PaginatedResponse,
  SearchResponse,
  createErrorWithContext,
} from "@bsport/store-base";

import {
  createEmailTemplateAPI,
  createEmailTemplateCategoryAPI,
  deleteEmailTemplateAPI,
  deleteEmailTemplateCategoryAPI,
  fetchAllEmailTemplatesAPI,
  fetchEmailTemplateCategoriesAPI,
  fetchEmailTemplateDetailAPI,
  fetchEmailTemplatesAPI,
  searchEmailTemplatesAPI,
  updateCategoryOrderingAPI,
  updateEmailTemplateCategoryAPI,
  updateEmailTemplateOrderingAPI,
} from "#src/api";
import {
  type CompanyTemplateFilters,
  type CreateEmailTemplateCategoryPayload,
  type DeleteEmailTemplateCategoryPayload,
  type DeleteEmailTemplatePayload,
  type EditEmailTemplatePayload,
  type EmailTemplateCategory,
  type EmailTemplateDetail,
  type EmailTemplateSummary,
  FUZZY_SEARCH_EMAIL_TEMPLATES_PAGE_SIZE,
  type FetchEmailTemplateCategoriesParams,
  type FetchEmailTemplateDetailParams,
  type FetchEmailTemplateSummaryParams,
  type SearchEmailTemplateParams,
  type UpdateCategoryOrderingPayload,
  type UpdateEmailTemplateCategoryPayload,
  type UpdateTemplateOrderingPayload,
} from "#src/types";

import {
  setEmailTemplateCategories,
  setEmailTemplateDetail,
  setEmailTemplateSummaries,
  setFuzzySearchEmailTemplateSummaries,
} from "./store";

// ----- Email Templates Summary Actions -----

/**
 * Fetches a list of paginated email template summaries.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 * @param params.id__in optional number[], the email templates ids list you want to fetch.
 * @param params.available optional boolean, if you want to fetch archived or unarchived templates.
 * @param params.company optional number, id of the company where you want to fetch the templates.
 */
export const fetchEmailTemplateSummariesAction: Action<
  FetchEmailTemplateSummaryParams,
  PaginatedResponse<EmailTemplateSummary>
> = async (fetch, params) => {
  const [uri, init] = fetchEmailTemplatesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEmailTemplateSummaries({
        emailTemplates: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch email templates summaries paginated",
        params,
      }),
  );
};

/**
 * Fetches a list of paginated email template summaries.
 * @noparam This function retrieves all the email templates linked to the studio assigned to the manager.
 */
export const fetchAllEmailTemplateSummariesAction: Action<
  CompanyTemplateFilters,
  EmailTemplateSummary[]
> = async (fetch, params) => {
  const [uri, init] = fetchAllEmailTemplatesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEmailTemplateSummaries({
        emailTemplates: data,
        page: 1,
        count: data.length,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch all email templates summaries",
        params,
      }),
  );
};

/**
 * Search for a paginated list of email template directly in the BackEnd
 * @param params.queryString Required string, title of the email template that you are searching
 * @param params.page Optionnal number, the page number you want to fetch, default is 1
 * @param params.page_size Optionnal number, the number of items per page, default is 10
 * @param params.company optional number, id of the category where you want to fetch the templates.
 * @param params.id__in optional number[], the email templates ids list you want to fetch.
 * @returns a paginated list of email templates matching the search params
 */
export const fuzzySearchEmailTemplateAction: Action<
  SearchEmailTemplateParams,
  SearchResponse<EmailTemplateSummary>
> = async (fetch, params) => {
  const [uri, init] = searchEmailTemplatesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      setFuzzySearchEmailTemplateSummaries({
        emailTemplates: data.results,
        count: Math.min(data.count, FUZZY_SEARCH_EMAIL_TEMPLATES_PAGE_SIZE),
        page: 1,
      });
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to fuzzy search the email template`,
        params,
      }),
  );
};

// ----- Email Templates Category Actions -----

/**
 * Fetches a list of paginated email categories.
 * @param params.page The page number.
 * @param params.page_size The number of items per page.
 */
export const fetchEmailTemplateCategoriesAction: Action<
  FetchEmailTemplateCategoriesParams,
  PaginatedResponse<EmailTemplateCategory>
> = async (fetch, params) => {
  const [uri, init] = fetchEmailTemplateCategoriesAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEmailTemplateCategories({
        categories: data.results,
        page: data.page,
        count: data.count,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch email templates categories",
        params,
      }),
  );
};

/**
 * Create a new Email Template Category to regroup your different email templates
 * @param params.name Required string for the category name
 * @returns the EmailTemplateCategory model of a newly created category or an error
 */
export const createEmailTemplateCategoryAction: Action<
  CreateEmailTemplateCategoryPayload,
  EmailTemplateCategory
> = async (fetch, params) => {
  const [uri, init] = createEmailTemplateCategoryAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to create the email template category`,
        params,
      }),
  );
};

/**
 * Update a new Email Template Category
 * @param params.name Required string for the category name
 * @param params.id Required number identifier of the category
 * @param params.company_id Required number id of the category to update
 * @param params.category_ordering Required number ordering of the category in the category list
 * @param params.items Required EmailTemplateSummary array of the category email templates
 * @returns the EmailTemplateCategory model of a newly created category or an error
 */
export const updateEmailTemplateCategoryAction: Action<
  UpdateEmailTemplateCategoryPayload,
  EmailTemplateCategory
> = async (fetch, params) => {
  const [uri, init] = updateEmailTemplateCategoryAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to update the email template category`,
        params,
      }),
  );
};

/**
 * Delete an email template category
 * @param params.id Required number id of the deleted email template category
 * @returns the EmailTemplateDetail model of a newly created template or an error
 */
export const deleteEmailTemplateCategoryAction: Action<
  DeleteEmailTemplateCategoryPayload,
  void
> = async (fetch, params) => {
  const [uri, init] = deleteEmailTemplateCategoryAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to delete the email template category`,
        params,
      }),
  );
};

// ----- Email Templates Detail Actions -----

/**
 * Fetches a list of paginated email template summaries.
 * @param params.id The id of the email template you want to fetch the details.
 */
export const fetchEmailTemplateDetailAction: Action<
  FetchEmailTemplateDetailParams,
  EmailTemplateDetail
> = async (fetch, params) => {
  const { id } = params;
  const [uri, init] = fetchEmailTemplateDetailAPI(id);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);

      setEmailTemplateDetail({
        emailTemplateDetail: data,
      });

      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: "Failed to fetch email template detail",
        params,
      }),
  );
};

/**
 * Create a new email template
 * @param params.title Required string for the email template title
 * @returns the EmailTemplateDetail model of a newly created template or an error
 */
export const createEmailTemplateAction: Action<
  EditEmailTemplatePayload,
  EmailTemplateDetail
> = async (fetch, params) => {
  const [uri, init] = createEmailTemplateAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to create the email template`,
        params,
      }),
  );
};

/**
 * Delete an email template
 * @param params.id Required number id of the deleted email template
 * @returns the EmailTemplateDetail model of a newly created template or an error
 */
export const deleteEmailTemplateAction: Action<
  DeleteEmailTemplatePayload,
  EmailTemplateDetail
> = async (fetch, params) => {
  const [uri, init] = deleteEmailTemplateAPI(params);

  return Result.try(
    async () => {
      await fetch(uri, init);

      return params as EmailTemplateDetail; // Return the params as a placeholder for the deleted template because the
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to delete the email template`,
        params,
      }),
  );
};

/**
 * Update order of an email template list
 * @param params.templateListToUpdate Required, Array of objects containing the id and
 *  ordering_in_category of each email template to update ordering of
 * @returns the updated list of all the update and ordered templates
 */
export const updateEmailTemplateOrderingAction: Action<
  UpdateTemplateOrderingPayload,
  UpdateTemplateOrderingPayload
> = async (fetch, params) => {
  const [uri, init] = updateEmailTemplateOrderingAPI(params);

  console.log("params : ", params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to update the ordering of the email templates`,
        params,
      }),
  );
};

/**
 * Update order of an email template category list
 * @param params.categoryListToUpdate Required, Array of objects containing the id and
 *  category_ordering of each email template category to update ordering of
 * @returns the updated list of all the update and ordered template categories
 */
export const updateCategoryOrderingAction: Action<
  UpdateCategoryOrderingPayload,
  UpdateCategoryOrderingPayload
> = async (fetch, params) => {
  const [uri, init] = updateCategoryOrderingAPI(params);

  return Result.try(
    async () => {
      const { data } = await fetch(uri, init);
      return data;
    },
    (error) =>
      createErrorWithContext(error, {
        message: `Failed to update the ordering of the categories`,
        params,
      }),
  );
};
