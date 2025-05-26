import type { CompanyThemeState } from "./store";

export const selectCompanyTheme = (state: CompanyThemeState) =>
  state.companyTheme;
