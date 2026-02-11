import React from "react";

import { type I18n, LOCALES, type Locale, switchLanguage } from "@bsport/i18n";
import { Select } from "@bsport/kaizen-primitive-core";

export type LanguageSelectorProps = {
  i18nInstance: I18n;
};

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  i18nInstance,
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
      defaultValue={
        i18nInstance.resolvedLanguage?.toLocaleUpperCase() || "Select language"
      }
      onSelect={(language) => {
        switchLanguage(language as Locale);
      }}
    />
  );
};

export default LanguageSelector;
