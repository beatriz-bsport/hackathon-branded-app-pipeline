import type { ConsumerSpaceWidgetConfig } from '#src/libs/exportable-components/types';
import type {
  MarketplaceCalendarVariant,
  MarketplaceNewsletterV2Data,
} from '#src/libs/marketplace/types';
import type { Coach } from '#src/libs/associated-coach/types';
import type { Establishment } from '#src/libs/establishment/types';
import type { Level } from '#src/libs/level/types';
import type { MetaActivity } from '#src/libs/meta-activity/types';
import type { PaymentPackCategory } from '#src/libs/payment-packs/types';
import type { PrivatePassCategory } from '#src/libs/private-service/types';
import type { Giftcard } from '#src/libs/giftcard/types';
import type { Video } from '#src/libs/video/types';

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
export const EXPORTABLE_COMPONENT_TYPE_NEWSLETTER_V2 = 'newsletterV2';
export const EXPORTABLE_COMPONENT_TYPE_NEWSLETTER = 'newsletter';
export const EXPORTABLE_COMPONENT_TYPE_GIFTCARD = 'giftcard';
export const EXPORTABLE_COMPONENT_TYPE_PAYMENT_PACK_TEMPLATE =
  'paymentPackTemplate';
export const EXPORTABLE_COMPONENT_TYPE_REFERRAL = 'referral';
export const EXPORTABLE_COMPONENT_TYPE_CONSUMER_SPACE = 'consumerSpace';

const LOGIN_WITH_DISCONNECTED_STATUS_DEFAULT_CONFIG: ConsumerSpaceWidgetConfig =
  {
    loginSubtitle: '',
    loginTitle: '',
    showSubtitle: true,
    showTitle: true,
  };

type CalendarDefaultConfig = {
  coaches: Array<Coach>;
  establishments: Array<Establishment>;
  metaActivities: Array<MetaActivity>;
  levels: Array<Level>;
  variant: MarketplaceCalendarVariant | null | undefined;
  groupSessionByPeriod: boolean;
};

export const EXPORTABLE_COMPONENTS = [
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_REFERRAL,
    label: 'referral',
    defaultConfig: {},
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CONSUMER_SPACE,
    label: 'consumerSpace',
    defaultConfig: {
      ...LOGIN_WITH_DISCONNECTED_STATUS_DEFAULT_CONFIG,
      hideNavigation: false,
      defaultPage: 'consumerBooking',
    },
  },
  // cf ExportableCalendarV2Settings.form.tsx
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_CALENDAR_V2,
    label: 'marketplace.calendar',
    defaultConfig: {
      coaches: [],
      establishments: [],
      metaActivities: [],
      levels: [],
      variant: null,
      groupSessionByPeriod: true,
    } as CalendarDefaultConfig,
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
    } as CalendarDefaultConfig,
  },

  {
    identifier: EXPORTABLE_COMPONENT_TYPE_WORKSHOP,
    label: 'marketplace.workshop',
    defaultConfig: {
      coaches: [] as Array<Coach>,
      establishments: [] as Array<Establishment>,
      metaActivities: [] as Array<MetaActivity>,
      levels: [] as Array<Level>,
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_PASS,
    label: 'marketplace.pass',
    defaultConfig: {
      paymentPackCategories: [] as Array<PaymentPackCategory>,
      privatePassCategories: [] as Array<PrivatePassCategory>,
    },
  },
  {
    label: 'marketplace.vod',
    identifier: EXPORTABLE_COMPONENT_TYPE_VOD,
    defaultConfig: {
      videos: [] as Array<Video>,
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
    identifier: EXPORTABLE_COMPONENT_TYPE_NEWSLETTER_V2,
    label: 'newsletter',
    defaultConfig: {
      fieldsType: 'fullNameAndEmail',
      title: undefined,
      showTitle: undefined,
      subtitle: undefined,
      showSubtitle: true,
      successTitle: undefined,
      showSuccessTitle: true,
      successText: undefined,
      showSuccessText: true,
    } as MarketplaceNewsletterV2Data,
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_GIFTCARD,
    label: 'giftcard',
    defaultConfig: {
      giftcards: [] as Array<Giftcard>,
    },
  },
  {
    identifier: EXPORTABLE_COMPONENT_TYPE_LOGIN_BUTTON,
    label: 'loginButton',
    defaultConfig: {
      openMemberProfile: true,
    },
  },
];
