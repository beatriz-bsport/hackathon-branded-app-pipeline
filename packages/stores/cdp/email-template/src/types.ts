// Data Model
export type EmailTemplateSummary = {
  available: boolean;
  available_for_companies: number[];
  category: number | null;
  company_id: number | null;
  date_modified: string;
  id: number;
  is_default_bsport_template: boolean;
  ordering_in_category: number;
  subject: string;
  title: string;
};

export type EmailTemplateCategory = {
  id: number;
  name: string;
  company: number;
  category_ordering: number;
};

export type EmailTemplateDetail = {
  design: string;
  html: string;
  franchisor_id?: number;
} & EmailTemplateSummary;

// API Query Params

export type EmailDesignTextSearchType = "title" | "company";

export type PaginationBaseParams = {
  page?: number;
  page_size?: number;
};

export type FetchEmailTemplateCategoriesParams = {
  company?: number;
  ordering?: "category_ordering" | "name" | "-category_ordering" | "-name";
} & PaginationBaseParams;

export type CompanyTemplateFilters = {
  id__in?: number[];
  company?: number;
  is_default_bsport_template?: boolean;
  is_franchise?: boolean;
};

export type FetchEmailTemplateSummaryParams = {
  id__in?: number[];
} & CompanyTemplateFilters &
  PaginationBaseParams;

export type SearchEmailTemplateParams = {
  queryString: string;
} & FetchEmailTemplateSummaryParams;

export type FetchEmailTemplateDetailParams = {
  id: number;
};

export type CreateEmailTemplateCategoryPayload = {
  name: string;
};

export type UpdateEmailTemplateCategoryPayload = {
  name?: string;
  category_ordering?: number;
  company_id?: number;
  id: number;
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
} & EditEmailTemplatePayload;

export type DeleteEmailTemplateCategoryPayload = {
  id: number;
};

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

export const FUZZY_SEARCH_EMAIL_TEMPLATES_PAGE_SIZE = 20;
