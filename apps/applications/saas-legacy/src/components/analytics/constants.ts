export const META_PIXEL_ID_STORAGE_KEY = 'metaPixelId';
/**
 * List of all the events automatically triggered by fbq function that we do not want to activate for now
 * Otherwise it will send those events to "hijacked" meta pixel id from other studio
 *  */
export const BLACKLIST_META_PIXEL_EVENT_LISTS = [
  'PageView',
  'SubscribedButtonClick',
  'Login',
];
