import { dataAccessLayer } from "@bsport/sm-backbone";

export const useFetchCompanyInformations = () => {
  const companyTheme = dataAccessLayer.useCompanyTheme();

  return {
    companyName: companyTheme?.company_name || "",
    // Use the first two characters of the locale for time formatting
    // The current format is "en_US", "fr_FR", etc. while we either
    // need "en" or "fr" or "en-US", "fr-FR"
    companyLocale: companyTheme?.locale.substring(0, 2) || "fr",
  };
};
