export const EXPORTABLE_COMPONENT_TYPE_VOD = 'vod';
export const EXPORTABLE_COMPONENT_TYPE_CALENDAR = 'calendar';
export const EXPORTABLE_COMPONENT_TYPE_WORKSHOP = 'workshop';
export const EXPORTABLE_COMPONENT_TYPE_PASS = 'pass';
export const EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE = 'privateService';
export const EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON = 'loginButton';
export const EXPORTABLE_COMPONENT_TYPE_PLAYLIST = 'playlist';
export const EXPORTABLE_COMPONENT_TYPE_SHOP = 'shop';
export const EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION = 'subscription';
export const EXPORTABLE_COMPONENT_TYPE_NEWSLETTER = 'newsletter';
export const EXPORTABLE_COMPONENT_TYPE_GIFTCARD = 'giftcard';

export const EXPORTABLE_COMPONENTS = [
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CALENDAR,
    label: 'marketplace.calendar',
    defaultConfig: {
      coaches: [],
      establishments: [],
      metaActivities: [],
      levels: [],
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
    label: 'marketplace.workshop',
    defaultConfig: {
      coaches: [],
      establishments: [],
      metaActivities: [],
      levels: [],
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PASS,
    label: 'marketplace.pass',
  },
  {
    label: 'marketplace.vod',
    identifier: EXPORTABLE_COMPONENT_TYPE_VOD,
    defaultConfig: {
      videoId: null,
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PRIVATE_SERVICE,
    label: 'marketplace.private_service',
    defaultConfig: {
      type: 'list', // or 'detail';
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_SUBSCRIPTION,
    label: 'marketplace.contract.tabName',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_SHOP,
    label: 'marketplace.shop.tabName',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PLAYLIST,
    label: 'marketplace.playlist',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_NEWSLETTER,
    label: 'newsletter',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
    label: 'giftcard',
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON,
    label: 'loginButton',
  },
];
