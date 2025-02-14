import React from "react";
import { initI18n, LOCALES } from "@bsport/i18n";
import { Select } from "@bsport/kaizen-primitive-core";

export type LanguageSelectorProps = {
  i18nInstance: ReturnType<typeof initI18n>;
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
      label={
        i18nInstance.resolvedLanguage?.toLocaleUpperCase() || "Select language"
      }
      onSelect={(lng) => {
        i18nInstance.changeLanguage(lng as string);
      }}
    />
  );
};

export default LanguageSelector;
