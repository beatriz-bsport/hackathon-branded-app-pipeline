export type SearchEmailTemplateParams = {
  q: string;
  id__in?: string;
  page?: number;
  page_size?: number;
};

export type FetchEmailTemplateCategoriesParams = {
  page?: number;
  page_size?: number;
  company?: number;
  ordering?: "category_ordering" | "name" | "-category_ordering" | "-name";
};

/**
 * Email template summary (list item from summary_paginated / summary endpoints).
 * Endpoint: GET customer-data-platform/v1/email_design/summary_paginated/
 * Endpoint: GET customer-data-platform/v1/email_design/summary/
 */
export type EmailTemplateSummary = {
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
};

/**
 * Email template full detail (single template).
 * Endpoint: GET customer-data-platform/v1/email_design/:id/
 */
export type EmailTemplateDetail = {
  design: string;
  html: string;
  franchisor_id?: number;
} & EmailTemplateSummary;

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

// ----- Query params for list/detail -----

export type CompanyTemplateFilters = {
  id__in?: string;
  company?: number;
  is_default_bsport_template?: boolean;
  is_franchise?: boolean;
};

export type FetchEmailTemplateSummaryParams = {
  page?: number;
  page_size?: number;
} & CompanyTemplateFilters;

// ----- Payloads for create/update/delete -----

export type CreateEmailTemplateCategoryPayload = {
  name: string;
};

export type UpdateEmailTemplateCategoryPayload = {
  id: number;
  name?: string;
  category_ordering?: number;
  company_id?: number;
  items?: EmailTemplateSummary[];
};

export type CreateEmailTemplatePayload = {
  title: string;
  subject: string;
  html: string;
  design: string;
  category: number | null;
  company_id: number | null;
  date_modified: string;
  available_for_companies?: number[];
};

export type EditEmailTemplatePayload = {
  id: number;
} & CreateEmailTemplatePayload;

export type DeleteEmailTemplatePayload = {
  id: number;
};

export type DeleteEmailTemplateCategoryPayload = {
  id: number;
};

// ----- Ordering -----

export type TemplateOrderingData = {
  id: number;
  ordering_in_category: number;
};

export type CategoryOrderingData = {
  id: number;
  category_ordering: number;
};

export type UpdateTemplateOrderingPayload = TemplateOrderingData[];

export type UpdateCategoryOrderingPayload = CategoryOrderingData[];
