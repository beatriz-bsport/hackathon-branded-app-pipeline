import {
  selectFeatures,
  useCompanyStore,
} from "@bsport/store-core-data-company";
import {
  selectCompanyTheme,
  useCompanyThemeStore,
} from "@bsport/store-core-data-company-theme";

const useCompanyFeatures = () => {
  return useCompanyStore(selectFeatures);
};

const useCompanyTheme = () => {
  return useCompanyThemeStore(selectCompanyTheme);
};

export const dataAccessLayer = {
  useCompanyFeatures,
  useCompanyTheme,
};
