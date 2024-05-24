import { useTranslation } from 'react-i18next';
import { AVAILABLE_LANGUAGES, LANGUAGES } from '#src/i18n/languages';

const useCurrentLanguageIsoCode = () => {
  const {
    i18n: { language },
  } = useTranslation();

  const isAvailable = (AVAILABLE_LANGUAGES as ReadonlyArray<string>).includes(
    language,
  );

  if (isAvailable) return language;

  // Some navigator doesn't give language on private session
  const split = language?.split('-')?.[0] ?? 'en-US';

  const isSplitAvailable = (
    AVAILABLE_LANGUAGES as ReadonlyArray<string>
  ).includes(split);
  if (isSplitAvailable) return split;

  return LANGUAGES.ENGLISH_BRITISH;
};

export default useCurrentLanguageIsoCode;
