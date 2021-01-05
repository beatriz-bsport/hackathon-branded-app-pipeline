export type Theme = {
  primary_color: string;
  secondary_color: string;
  cover?: string;
  websiteURL?: string;
  scheduleURL?: string;
  facebookURL?: string;
  instagramURL?: string;
  company: number;
  company_name: string;
  general_terms_and_conditions: string;
  general_terms_of_use: string;
  gtmId?: string;
  facebookPixelId?: string;
  timezone_name: string;
  show_cancelled_offers_customer: boolean;
};

export type ThemeState = {
  theme: Theme;
  createOrUpdate: {
    loading: boolean;
    error?: Error;
  };
  loading: boolean;
  error?: Error;
};
