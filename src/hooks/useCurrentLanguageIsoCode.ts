import { useTranslation } from 'react-i18next';
import { availableLanguages } from '../i18n';

const useCurrentLanguageIsoCode = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const isAvailable = availableLanguages.find(({ lang }) => lang === language);

  if (isAvailable) return language;

  const split = language.split('-')[0];
  const isSplitAvailable = availableLanguages.find(
    ({ lang }) => lang === split,
  );
  if (isSplitAvailable) return split;

  return 'en-GB';
};

export default useCurrentLanguageIsoCode;
