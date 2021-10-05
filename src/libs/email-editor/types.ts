export type EmailTemplateSummary = {
  id: number;
  date_created?: string;
  date_modified: string;
  subject: string;
  title: string;
  company_id?: number;
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
};

export type EmailTemplateState = {
  byId: { [key: string]: EmailTemplateSummary };
  allIds: Array<number>;
  detail: {
    isLoading: boolean;
    error?: Error | null;
    byId: { [key: string]: EmailTemplateDetail };
  };
  isLoading: boolean;
  error?: Error;
  hasBeenLoadedOnce: boolean;
  upsert: {
    isLoading: boolean;
    error?: Error | null;
  };
  savedFilter: {
    isLoading: boolean;
    error?: Error | null;
    filters: string[];
  };
};

export type FranchisorSavedFilter = {
  name: 'email-design';
  filters: string[];
};
