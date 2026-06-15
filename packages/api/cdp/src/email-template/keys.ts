import { QUERY_KEY_MAIN } from "#src/constants";

export type EmailTemplateSearchKeyParams = {
  query: string;
  id__in?: string;
  page: number;
  page_size: number;
};

/**
 * React Query keys for email templates, aligned with the smartlists app cache prefix
 */
export const emailTemplateKeys = {
  emailTemplate: () => [QUERY_KEY_MAIN, "email-template"] as const,

  emailTemplateDetail: (emailTemplateId: number) =>
    [...emailTemplateKeys.emailTemplate(), emailTemplateId] as const,

  emailTemplateSearch: () =>
    [...emailTemplateKeys.emailTemplate(), "search"] as const,

  emailTemplateSearchQueries: (params: EmailTemplateSearchKeyParams) =>
    [...emailTemplateKeys.emailTemplateSearch(), params] as const,

  emailTemplateCategories: () =>
    [...emailTemplateKeys.emailTemplate(), "categories"] as const,
} as const;
