import { STORAGE_KEY_BSPORT_I18NEXTLNG } from './actions/constants';
import { getItemInStorage } from './utils/storage';

/// Returns the current language for Intercom based on the stored language.
const getCurrentIntercomLanguage = () =>
  (getItemInStorage('local', STORAGE_KEY_BSPORT_I18NEXTLNG) || 'en').slice(
    0,
    2,
  );

type IntercomPageName =
  | 'login'
  | 'paymentLink'
  | 'stopSubscriptionOnMemberSide'
  | 'default';

export const getIntercomLink = (pageName?: IntercomPageName): string => {
  const baseIntercomUrl = `https://intercom.help/bsport-helpcenter/${getCurrentIntercomLanguage()}`;
  switch (pageName) {
    case 'login':
      return `${baseIntercomUrl}/collections/2348822`;
    case 'paymentLink':
      return `${baseIntercomUrl}/articles/5621567`;
    case 'stopSubscriptionOnMemberSide':
      return `${baseIntercomUrl}/articles/10730208-how-can-your-members-cancel-their-subscription`;
    default:
      return `${baseIntercomUrl}`;
  }
};

export const openIntercomHelp = (pageName?: IntercomPageName) => {
  window.open(getIntercomLink(pageName));
};
