import { ReactElement } from 'react';
/* 
TODOS : 
Implement and uncomment the imports below kept as placeholders.
Fix typing as is it a very sensitive one to ensure evrything works properly.
*/
// import {
//   MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
//   MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceOfferListItemCSSOnly';
// import {
//   MARKETPLACE_LEVEL_CONFIGURATION,
//   MARKETPLACE_LEVEL_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceLevelCSSOnly';
// import {
//   MARKETPLACE_BROADCAST_CONFIGURATION,
//   MARKETPLACE_BROADCAST_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceBroadcastCSSOnly';
// import {
//   MARKETPLACE_WORKSHOP_CONFIGURATION,
//   MARKETPLACE_WORKSHOP_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceWorkshop.component';
import {
  MARKETPLACE_OFFER_CARD_CONFIGURATION,
  MARKETPLACE_OFFER_CARD_PREVIEW,
} from '#libs/marketplace/components/MarketplaceCardOfferCSSOnly';
// import {
//   MARKETPLACE_GROUP_OFFER_LIST_ITEM_CONFIGURATION,
//   MARKETPLACE_GROUP_OFFER_LIST_ITEM_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceGroupOfferListItem.component';
// import {
//   MARKETPLACE_WORKSHOP_CARD_CONFIGURATION,
//   MARKETPLACE_WORKSHOP_CARD_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceWorkshopCard.component';
// import {
//   MARKETPLACE_FILTER_CONFIGURATION,
//   MARKETPLACE_FILTER_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceFilterCSSOnly';
// import {
//   MARKETPLACE_FILTERS_CONFIGURATION,
//   MARKETPLACE_FILTERS_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceFiltersCSSOnly';
// import {
//   MARKETPLACE_BOOK_BUTTON_CONFIGURATION,
//   MARKETPLACE_BOOK_BUTTON_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceBookButtonCSSOnly';
// import {
//   MARKETPLACE_DATE_PICKER_CONFIGURATION,
//   MARKETPLACE_DATE_PICKER_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceDatePicker';
// import {
//   MARKETPLACE_ACTIVITY_CONFIGURATION,
//   MARKETPLACE_ACTIVITY_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceActivityCSSOnly';
// import {
//   MARKETPLACE_CALENDAR_CONFIGURATION,
//   MARKETPLACE_CALENDAR_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceCalendarCSSOnly';
// import {
//   MARKETPLACE_TIME_TABLE_CONFIGURATION,
//   MARKETPLACE_TIME_TABLE_PREVIEW,
// } from '#libs/marketplace/components/MarketplaceWeekTimeTableCSSOnly';

import { MarketplaceCSSComponentConfig } from './types';

export const EXPORTABLE_COMPONENT_TYPE_VOD = 'vod';
export const EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2 = 'calendarV2';
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
export const EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE =
  'paymentPackTemplate';

export const EXPORTABLE_COMPONENTS = [
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
    label: 'marketplace.calendar',
    defaultConfig: {
      // @ts-ignore
      coaches: [],
      // @ts-ignore
      establishments: [],
      // @ts-ignore
      metaActivities: [],
      // @ts-ignore
      levels: [],
      // @ts-ignore
      variant: null,
      groupSessionByPeriod: true,
    },
  },

  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CALENDAR,
    label: 'marketplace.calendar',
    defaultConfig: {
      coaches: [],
      establishments: [],
      metaActivities: [],
      levels: [],
      variant: null,
      groupSessionByPeriod: true,
    },
  },

  {
    identifier: EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
    label: 'marketplace.workshop',
    defaultConfig: {
      // @ts-ignore
      coaches: [],
      // @ts-ignore
      establishments: [],
      // @ts-ignore
      metaActivities: [],
      // @ts-ignore
      levels: [],
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PASS,
    label: 'marketplace.pass',
    defaultConfig: {
      // @ts-ignore
      paymentPackCategories: [],
      // @ts-ignore
      privatePassCategories: [],
    },
  },
  {
    label: 'marketplace.vod',
    identifier: EXPORTABLE_COMPONENT_TYPE_VOD,
    defaultConfig: {
      // @ts-ignore
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
    defaultConfig: {
      // @ts-ignore
      giftcards: [],
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON,
    label: 'loginButton',
  },
];

export type SetState = (key: string) => (value: any) => void;

//
// TEMPLATE
//
// {
//   label: 'filters', /* the uniq key of the component*/
//   css: MarketplaceFiltersCSS, /* the uniq css imported as raw string upper in the component*/
//   pages: ['workshop', 'calendar'], /* All the page of the widget where the component is use */
//   showAsFlex: true, /* Boolean to display the component as center for small component */
//   defaultState: { example: true },
//   variations: [      /* Array of configuration to modify the props send to the component */
//    loadingVariation,
//    variantVariation,
//   ],
//   defaultVariation: [ /* Default configuration to use <!> The order must be the same as the upper configuration <!> */
//    defaultLoadingVariation,
//    defaultVariantVariation,
//   ],
//    },
//  }

export const CSS_COMPONENTS: MarketplaceCSSComponentConfig[] = [
  // MARKETPLACE_FILTER_CONFIGURATION,
  // MARKETPLACE_FILTERS_CONFIGURATION,
  // MARKETPLACE_DATE_PICKER_CONFIGURATION,
  // MARKETPLACE_GROUP_OFFER_LIST_ITEM_CONFIGURATION,
  // MARKETPLACE_OFFER_LIST_ITEM_CONFIGURATION,
  // MARKETPLACE_WORKSHOP_CARD_CONFIGURATION,
  MARKETPLACE_OFFER_CARD_CONFIGURATION,
  // MARKETPLACE_TIME_TABLE_CONFIGURATION,
  // MARKETPLACE_ACTIVITY_CONFIGURATION,
  // MARKETPLACE_BOOK_BUTTON_CONFIGURATION,
  // MARKETPLACE_LEVEL_CONFIGURATION,
  // MARKETPLACE_BROADCAST_CONFIGURATION,
  // MARKETPLACE_CALENDAR_CONFIGURATION,
  // MARKETPLACE_WORKSHOP_CONFIGURATION,
];

// We are using another object for the render to avoid importing unnecessary module
// in the widget
//
//  Template
//
//   key: (props: { /* The render of the component for the editor */
//        theme, /* Company theme */
//        setState, /* implementation of a state for component where needed */
//        state,
//        {...variations} /* all the variations add new props needed by the components */
//      }) => {
//    return (
//      <MarketplaceFilters {...variations} />
//    );

export const CSS_COMPONENTS_BY_ID: Record<
  string,
  (props: any) => ReactElement
> = {
  // filter: MARKETPLACE_FILTER_PREVIEW,
  // filters: MARKETPLACE_FILTERS_PREVIEW,
  // datePicker: MARKETPLACE_DATE_PICKER_PREVIEW,
  // groupOfferListItem: MARKETPLACE_GROUP_OFFER_LIST_ITEM_PREVIEW,
  // offerListItem: MARKETPLACE_OFFER_LIST_ITEM_PREVIEW,
  // workshopCard: MARKETPLACE_WORKSHOP_CARD_PREVIEW,
  cardOffer: MARKETPLACE_OFFER_CARD_PREVIEW,
  // timeTable: MARKETPLACE_TIME_TABLE_PREVIEW,
  // activity: MARKETPLACE_ACTIVITY_PREVIEW,
  // bookButton: MARKETPLACE_BOOK_BUTTON_PREVIEW,
  // level: MARKETPLACE_LEVEL_PREVIEW,
  // vodTag: MARKETPLACE_BROADCAST_PREVIEW,
  // calendar: MARKETPLACE_CALENDAR_PREVIEW,
  // workshopsComponent: MARKETPLACE_WORKSHOP_PREVIEW,
};

export default CSS_COMPONENTS;
