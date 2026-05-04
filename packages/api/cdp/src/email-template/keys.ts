import {
  EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE,
  EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE_SIZE,
} from "./constants";

/**
 * React Query keys for email templates, aligned with the smartlists app cache prefix
 * `["@sm-smartlist", "email-template", ...]`.
 */
export const emailTemplateKeys = {
  emailTemplate: () => ["@sm-smartlist", "email-template"] as const,

  emailTemplateDetail: (emailTemplateId: number) =>
    [...emailTemplateKeys.emailTemplate(), emailTemplateId] as const,

  emailTemplateSearch: () =>
    [...emailTemplateKeys.emailTemplate(), "search"] as const,

  emailTemplateSearchQueries: (
    query: string,
    id__in?: string,
    page?: number,
    page_size?: number,
  ) =>
    [
      ...emailTemplateKeys.emailTemplateSearch(),
      query,
      id__in ?? "",
      page ?? EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE,
      page_size ?? EMAIL_TEMPLATE_SEARCH_DEFAULT_PAGE_SIZE,
    ] as const,

  emailTemplateCategories: () =>
    [...emailTemplateKeys.emailTemplate(), "categories"] as const,
} as const;
