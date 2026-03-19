export type SearchEmailTemplateParams = {
  q: string;
  id__in?: string;
  page?: number;
  page_size?: number;
};

export type FetchEmailTemplateCategoriesParams = {
  page?: number;
  page_size?: number;
};

/**
 * Email template search result (summary shape from search endpoint).
 * Endpoint: GET customer-data-platform/v1/email_design/search/
 */
export type EmailTemplateSearchResult = {
  id: number;
  title: string;
  subject: string;
  category: number | null;
  available: boolean;
  available_for_companies: number[];
  company_id: number | null;
  date_modified: string;
  is_default_bsport_template: boolean;
  ordering_in_category: number;
  design?: string | null;
  html?: string | null;
};

/**
 * Email template category from the API.
 * Endpoint: GET customer-data-platform/v1/email_design/email_design_category/
 */
export type EmailTemplateCategory = {
  id: number;
  name: string;
  company: number;
  category_ordering: number;
};
