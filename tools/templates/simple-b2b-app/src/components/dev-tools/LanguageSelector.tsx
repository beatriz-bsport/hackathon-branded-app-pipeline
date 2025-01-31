import { useTranslation, LOCALES } from "#src/utils/i18n";
import { Select } from "@bsport/kaizen-primitive-core";

const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
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
      label={i18n.resolvedLanguage?.toLocaleUpperCase() || "Select language"}
      onSelect={(lng) => {
        i18n.changeLanguage(lng as string);
      }}
    />
  );
};

export default LanguageSelector;
