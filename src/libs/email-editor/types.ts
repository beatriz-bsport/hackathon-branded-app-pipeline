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
    byId: { [key: string]: EmailTemplateDetail };
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
