import memoize from 'memoize-one';
import { AVAILABLE_LANGUAGES, LANGUAGES } from '../i18n/languages';

// ISO 639-1 format for language : two letters (fr for French)
// We got 6 languages on Intercom : fr, en, nl, it, es, de
// So we don't bother with variants like en-US / en-GB
export const getCurrentLanguageIsoCode = memoize((language: string) => {
  let languageIso: string = '';
  if (['en-GB', 'en-gb'].includes(language)) {
    languageIso = LANGUAGES.ENGLISH_BRITISH;
  } else {
    languageIso = language?.split('-')?.[0] ?? 'en';
  }
  const isSplitAvailable = (
    AVAILABLE_LANGUAGES as ReadonlyArray<string>
  ).includes(languageIso);
  if (isSplitAvailable) return languageIso;

  const isFullAvailable = (
    AVAILABLE_LANGUAGES as ReadonlyArray<string>
  ).includes(language);
  if (isFullAvailable) return language.split('-')[0];
  return LANGUAGES.ENGLISH;
});
