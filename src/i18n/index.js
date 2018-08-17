import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import Moment from 'moment';
import 'moment/locale/fr';

import ENGLISH_PACK from './english.translation';
import FRENCH_PACK from './french.translation';

i18n.on('languageChanged', (lng) => {
  Moment.locale(lng);
});

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en-US',

    // have a common namespace used around the full app
    ns: ['translations'],

    debug: true,

    resources: {
      'en-US': ENGLISH_PACK,
      'fr-FR': FRENCH_PACK,
    },

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default',
    },
  });

const availableLanguages = [
  {
    lang: 'en-US',
    translation: ENGLISH_PACK,
  },
  {
    lang: 'fr-FR',
    translation: FRENCH_PACK,
  },
];

Moment.locale(i18n.lng);

export default i18n;
export { Moment, availableLanguages };
