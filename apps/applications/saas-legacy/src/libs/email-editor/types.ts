import { ErrorAndLoading } from '../../state/types';

export type EmailTemplateSummary = {
  available_for_companies: number[];
  available: boolean;
  category: number;
  company_id: number | null;
  date_modified: string;
  id: number;
  is_default_bsport_template: boolean;
  ordering_in_category: number;
  subject: string;
  title: string;
};

export type EmailDesignQueryParams = {
  id__in?: number[];
  avaiable?: boolean;
  available_for_companies?: number[];
  company?: number;
  is_franchise?: boolean;
  is_default_bsport_template?: boolean;
};
export type EmailDesignQueryParamsPaginated = EmailDesignQueryParams & {
  page: number;
  page_size?: number;
};

export type EmailTemplateDetail = {
  company_id?: number;
  design: any;
  html: string;
  id: number;
  name: string;
};

export type EmailTemplate = {
  id: number;
  available: boolean;
  category: number | null;
  date_modified?: string;
  design: any;
  html: string;
  ordering_in_category: number;
  subject: string;
  title: string;
  available_for_companies: number[];
  company_id: number | null;
  franchise_id?: number;
  is_default_bsport_template: boolean;
};

export type EmailEditAPIParams = {
  title: string;
  subject: string;
  design: string;
  html: string;
  category: number | null;
  date_modified?: string;
  company_id?: number;
  franchise_id?: number;
  available_for_companies?: number[];
};

export type FranchiseEmailDesignState = {
  /**
   * @description A store containing EmailDesign created by the franchisor.
   * These EmailDesign can then be shared to franchisees via : available_for_companies attribute.
   */
  ownedByFranchisor: {
    page: number;
    next_page: number | null;
    previous_page: number | null;
    count: number;
    page_size: number;
    allIds: number[];
    byId: Record<number, EmailTemplateSummary>;
  } & ErrorAndLoading;
  /**
   * @description A store containing EmailDesign created by the franchisees.
   */
  ownedByFranchisee: {
    page: number;
    next_page: number | null;
    previous_page: number | null;
    count: number;
    page_size: number;
    allIds: number[];
    byId: Record<number, EmailTemplateSummary>;
  } & ErrorAndLoading;
  /**
   * @description A store containing EmailDesign created by bsport and available for everyone.
   * In the franchise context the back-end takes care of filtering the EmailDesign with the proper language.
   */
  bsportDefault: {
    page: number;
    next_page: number | null;
    previous_page: number | null;
    count: number;
    page_size: number;
    allIds: number[];
    byId: Record<number, EmailTemplateSummary>;
  } & ErrorAndLoading;
};
export type EmailTemplateState = {
  byId: { [key: string]: EmailTemplateSummary };
  allIds: Array<number>;
  detail: {
    loading: boolean;
    error?: Error | null;
    byId: { [key: string | number]: EmailTemplateDetail };
  };
  loading: boolean;
  error?: Error;
  hasBeenLoadedOnce: boolean;
  upsert: {
    loading: boolean;
    error?: Error | null;
  };
  savedFilter: {
    loading: boolean;
    error?: Error | null;
    filters: string[];
  };
  emailTemplateCategory: {
    byId: { [id: number]: EmailTemplateCategory };
    allIds: Array<number>;
    loading: boolean;
    error?: Error;
    upsert: {
      loading: boolean;
      error?: Error;
    };
  };
  currentTemplateMetaData?: {
    required_tags_list?: string[];
    related_notification_rule_events?: number[];
  } & ErrorAndLoading;
  franchise: FranchiseEmailDesignState;
};

export type FranchisorSavedFilter = {
  name: 'email-design';
  filters: string[];
};

export type EmailTemplateCategory = {
  id: number;
  name: string;
  company: number;
  category_ordering: number;
};

export type EmailTemplateCategoryWithTemplates = EmailTemplateCategory & {
  items: Array<EmailTemplate>;
};

export type ResolvedGenericTags =
  | {}
  | {
      '{android_app_URL}': string;
      '{ios_app_URL}': string;
      '{company_logo}': string;
      '{company}': string;
      '{login_url}': string;
      '{company_scheduleURL}': string;
      '{company_facebookURL}': string;
      '{company_instagramURL}': string;
      '{company_websiteURL}': string;
      '{company_info}': string;
    };
