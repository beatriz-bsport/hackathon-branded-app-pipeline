import { Coach } from '#libs/associated-coach/types';
import { Establishment } from '#libs/establishment/types';
import { MetaActivity } from '#libs/meta-activity/types';
import { Offer } from '#libs/offer/types';
import { ErrorAndLoading } from '#libs/types';

/**
 * The available components we can use in the marketplace
 */
export type MarketplaceCommonFilter = {
  coaches?: number[];
  establishments?: number[];
  metaActivities?: number[];
  levels?: number[];
  establishmentGroups?: number[];
};

export type MarketplaceCalendarData = MarketplaceCommonFilter & {
  compactMode?: true | false | null;
  todayOnly?: boolean;
};

export type MarketplaceCalendarV2Data = MarketplaceCommonFilter & {
  compactMode?: true | false | null;
  todayOnly?: boolean;
  variant?: MarketplaceCalendarVariant;
  groupSessionByPeriod?: boolean;
};

export type MarketplaceCalendarVariant = 'activityName' | 'coach' | 'time';

export type MarketplaceWorkshopData = MarketplaceCommonFilter;

export type MarketplacePrivateServiceData = {
  type: 'list' | 'detail';
  serviceId?: number | null;
  privateGroups?: number[] | null;
};

export type MarketplacePassData = {
  hidePaymentPack?: boolean;
  hidePrivatePass?: boolean;
  hidePaymentCombo?: boolean;
  paymentPackCategories?: number[];
  privatePassCategories?: number[];
};

export type MarketplacePaymentPackTemplateData = {
  paymentPackTemplateList?: Array<number>;
};

export type MarketplaceGiftcardData = {
  giftcards?: number[];
};

export type MarketplaceVODData = {
  videoId?: number;
};

export type MarketplacePlaylistData = {
  playlistId?: number;
};

export type MarketplaceComponentConfig = {
  calendar?: MarketplaceCalendarData;
  workshop?: MarketplaceWorkshopData;
  privateService?: MarketplacePrivateServiceData;
  paymentPackTemplate?: MarketplacePaymentPackTemplateData;
  pass?: MarketplacePassData;
  vod?: {};
  subscription?: {};
  shop?: {};
  playlist?: MarketplacePlaylistData;
};

export type MarketplaceTabConfig = {
  component_type: string;
  title: string;
  index: number;
  config: MarketplaceComponentConfig;
};

export type WidgetConfig = {
  parentElement: string;
  companyId: number;
  franchiseId: number;
  dialogMode: 0 | 1 | 2;
  language?: string;
  widgetType: string;
  config: MarketplaceComponentConfig;
  showFab: boolean;
  fullScreenPopup: boolean;
};

export type MarketplaceSettings = {
  company: number;
  id: number;
  is_custom: boolean;
  config: MarketplaceTabConfig[];
};

export type MarketplaceSettingState = {
  loading: boolean;
  error?: Error;
  settings: MarketplaceSettings;
};

export type MarketplaceMetaActivity = MetaActivity &
  ErrorAndLoading & {
    nextPage: number | null;
    count: number;
    offers: Offer<Coach, Establishment>[];
  };

export type MarketPlaceFilter = {
  coaches: number[];
  establishments: number[];
  levels: number[];
  activity__in: number[];
  establishment_group__in: number[];
};
