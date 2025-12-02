import { dataAccessLayer } from "@bsport/sm-backbone";

import { i18nInstance } from "#src/utils/i18n";

const DEFAULT_LOCALE = "en";
const DEFAULT_TIMEZONE = "Europe/Paris";

export const useCompanyData = () => {
  const companyData = dataAccessLayer.useCompanyTheme();
  const companyTimezone = companyData?.timezone_name || DEFAULT_TIMEZONE;
  const userLocale = i18nInstance.language || DEFAULT_LOCALE;
  const companyId = companyData?.company || 0;
  const companyName = companyData?.company_name || "";
  return {
    companyTimezone,
    companyName,
    companyId,
    userLocale,
  };
};
