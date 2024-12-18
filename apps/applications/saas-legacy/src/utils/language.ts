import memoize from 'memoize-one';
import { AVAILABLE_LANGUAGES, LANGUAGES } from '../i18n/languages';
import { LOCALE_LIST } from '#src/components/input/LocaleSelector.component';

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

/**
 * Retrieve a locale as xx_XX from a language xx.
 *
 * @export
 * @param {string} language The language to get the locale from.
 * @return {string | undefined} The locale associated, by default "en_US" for "en" language, or undefined if not found.
 */
export const getLocaleFromLanguage = memoize((language: string) => {
  if (['en-GB', 'en-gb'].includes(language)) {
    return 'en_GB';
  }
  const LANGUAGE_LIST_WITHOUT_GB = LOCALE_LIST.filter(
    (country) => country.locale !== 'en_GB',
  );
  return LANGUAGE_LIST_WITHOUT_GB.find(
    (country) => country.locale.slice(0, 2) === language,
  )?.locale;
});
