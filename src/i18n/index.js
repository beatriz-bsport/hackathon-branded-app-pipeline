import i18n from './i18n';
import ENGLISH_PACK from './english.translation';
import FRENCH_PACK from './french.translation';

export default i18n;

export const availableLanguages = [
  {
    lang: 'en-US',
    translation: ENGLISH_PACK,
  },
  {
    lang: 'fr-FR',
    translation: FRENCH_PACK,
  },
];
