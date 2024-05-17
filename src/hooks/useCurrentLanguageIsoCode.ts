import { useTranslation } from 'react-i18next';
// @ts-expect-error
import { availableLanguages } from '../i18n';

const useCurrentLanguageIsoCode = () => {
  const {
    i18n: { language },
  } = useTranslation();

  // @ts-expect-error
  const isAvailable = availableLanguages.find(({ lang }) => lang === language);

  if (isAvailable) return language;

  // Some navigator doesn't give language on private session
  const split = language?.split('-')?.[0] ?? 'en-US';

  const isSplitAvailable = availableLanguages.find(
    // @ts-expect-error
    ({ lang }) => lang === split,
  );
  if (isSplitAvailable) return split;

  return 'en-GB';
};

export default useCurrentLanguageIsoCode;
