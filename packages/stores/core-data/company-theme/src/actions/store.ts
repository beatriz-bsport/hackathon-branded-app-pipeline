import { companyThemeStore } from "#src/store";
import type { CompanyTheme } from "#src/types";

export const setCompanyTheme = (theme: CompanyTheme) => {
  companyThemeStore.setState((state) => {
    if (!theme) return state;

    return {
      companyTheme: theme,
    };
  });
};
