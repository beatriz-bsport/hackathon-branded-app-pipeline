import React from "react";
import { initI18n, LOCALES, type Locale } from "@bsport/i18n";
import { Select } from "@bsport/kaizen-primitive-core";

export type LanguageSelectorProps = {
  i18nInstance: ReturnType<typeof initI18n>;
  appsLanguageSwitchers?: Array<(languageId: Locale) => void>;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  i18nInstance,
  appsLanguageSwitchers,
}) => {
  const localeItems = LOCALES.map((locale) => {
    return {
      id: locale,
      label: locale.toLocaleUpperCase(),
    };
  });
  return (
    <Select
      id="language-selector"
      items={localeItems}
      name="language-selector"
      label={
        i18nInstance.resolvedLanguage?.toLocaleUpperCase() || "Select language"
      }
      onSelect={(language) => {
        i18nInstance.changeLanguage(language);
        appsLanguageSwitchers?.forEach((appLanguageSwitcher) => {
          appLanguageSwitcher?.(language as Locale);
        });
      }}
    />
  );
};

export default LanguageSelector;
