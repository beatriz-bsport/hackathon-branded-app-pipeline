export type EmailTemplateSummary = {
  id: number;
  date_created?: string;
  date_modified: string;
  subject: string;
  title: string;
};

export type EmailTemplateDetail = {
  id: number;
  company_id: number;
  name: string;
  html: string;
  design: any;
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
};
