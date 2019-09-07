// @flow

export type Theme = {
  primary_color: string,
  secondary_color: string,
  cover: ?string,
  websiteURL: ?string,
  scheduleURL: ?string,
  facebookURL: ?string,
  instagramURL: ?string,
  company: number,
  company_name: string,
  general_terms_and_conditions: string,
};

export type ThemeState = {
  theme: Theme,
  createOrUpdate: {
    loading: boolean,
    error: ?Error,
  },
  loading: boolean,
  error: ?Error,
};
