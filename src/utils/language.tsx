// @ts-nocheck
// @ts-ignore
import memoize from 'memoize-one';
// @ts-ignore
import { availableLanguages } from '../i18n/index';

// ISO 639-1 format for language : two letters (fr for French)
// We got 6 languages on Intercom : fr, en, nl, it, es, de
// So we don't bother with variants like en-US / en-GB
export const getCurrentLanguageIsoCode = memoize((language: string) => {
  const languageIso = language?.split('-')?.[0] ?? 'en';
  const isSplitAvailable = availableLanguages.find(
    ({ lang }: { lang: string }) => lang === languageIso,
  );
  if (isSplitAvailable) return languageIso;

  const isFullAvailable = availableLanguages.find(
    ({ lang }: { lang: string }) => lang === language,
  );
  if (isFullAvailable) return language.split('-')[0];
  return 'en';
});
