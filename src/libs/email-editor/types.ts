import { ErrorAndLoading } from '../../state/types';

export type EmailTemplateSummary = {
  available_for_companies?: number[];
  available: boolean;
  category: number;
  company_id?: number;
  date_created?: string;
  date_modified: string;
  id: number;
  is_default_bsport_template: boolean;
  ordering_in_category: number;
  subject: string;
  title: string;
};

export type EmailTemplateDetail = {
  company_id?: number;
  design: any;
  html: string;
  id: number;
  name: string;
};

export type EmailTemplate = {
  available: boolean;
  category: number;
  company_id?: number;
  date_modified?: string;
  design: any;
  franchise_id?: number;
  html: string;
  id: number;
  ordering_in_category: number;
  subject: string;
  title: string;
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
