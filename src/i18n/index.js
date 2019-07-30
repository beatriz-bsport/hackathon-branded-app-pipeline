import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';
import Moment from 'moment';
import 'moment/locale/fr';

import ENGLISH_PACK from './english.translation';
import FRENCH_PACK from './french.translation';
import SPANISH_PACK from './spanish.translations';

i18n
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'fr-FR',

    // have a common namespace used around the full app
    defaultNS: 'translation',

    debug: !['production', 'test'].includes(process.env.NODE_ENV),

    resources: {
      'fr-FR': FRENCH_PACK,
      'en-US': ENGLISH_PACK,
      'es-ES': SPANISH_PACK,
    },

    interpolation: {
      format(value, format) {
        if (format === 'uuid' && typeof value === 'string') {
          return value.slice(0, 8);
        }
        if (format === 'price') {
          if (typeof value === 'string') return `${value}€`;
          if (typeof value === 'number') return `${value.toFixed(2)}€`;
        }
        return value;
      },
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
    lang: 'fr-FR',
    translation: FRENCH_PACK,
  },
  {
    lang: 'en-US',
    translation: ENGLISH_PACK,
  },
  {
    lang: 'es-ES',
    translation: SPANISH_PACK,
  },
];

i18n.on('languageChanged', (lng) => {
  Moment.locale(lng);
});

Moment.locale(i18n.lng);

export default i18n;
export { Moment, availableLanguages };
