import { STORAGE_KEY_BSPORT_I18NEXTLNG } from './actions/constants';

const storage = window.localStorage;

const language = (storage.getItem(STORAGE_KEY_BSPORT_I18NEXTLNG) || '').slice(
  0,
  2,
);

export const openIntercomHelp = (pageName?: string) => {
  switch (pageName) {
    case 'login':
      window.open(
        `https://intercom.help/bsport-helpcenter/${
          language || 'fr'
        }/collections/2348822`,
      );
      break;
    case 'paymentLink':
      window.open(
        `https://intercom.help/bsport-helpcenter/${
          language !== 'fr' ? 'en' : 'fr'
        }/articles/5621567`,
      );
      break;
    default:
      window.open(
        `https://intercom.help/bsport-helpcenter/${language || 'fr'}`,
      );
      break;
  }
};
