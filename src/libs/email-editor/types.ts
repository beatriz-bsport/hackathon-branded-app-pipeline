import { ErrorAndLoading } from '../../state/types';

// @ts-nocheck
export type EmailTemplateSummary = {
  id: number;
  date_created?: string;
  date_modified: string;
  subject: string;
  title: string;
  company_id?: number;
  available_for_companies?: number[];
  category: number;
  ordering_in_category: number;
  available: boolean;
  is_default_bsport_template: boolean;
};

export type EmailTemplateDetail = {
  id: number;
  company_id?: number;
  name: string;
  html: string;
  design: any;
};

export type EmailTemplate = {
  id: number;
  company_id?: number;
  franchise_id?: number;
  title: string;
  subject: string;
  html: string;
  design: any;
  date_modified?: string;
  category: number;
  ordering_in_category: number;
  available: boolean;
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
