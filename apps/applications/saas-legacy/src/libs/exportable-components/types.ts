/**
 * The available components we can use in the marketplace
 */

import { FC } from 'react';
import { ErrorAndLoading } from '#src/libs/types';

import { CssComponentsVariantIdentifiers } from './constants';

export type MarketplaceCommonFilter = {
  coaches?: number[];
  establishments?: number[];
  metaActivities?: number[];
  levels?: number[];
  establishmentGroups?: number[];
};

export type MarketplaceCalendarData = MarketplaceCommonFilter & {
  // @deprecated use cardMode instead
  compactMode?: true | false | null;
  cardMode?: true | false | null;
  todayOnly?: boolean;
};

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
  paymentPackCategoriesList?: number[];
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

export type MarketplaceLoginButtonWidgetConfig = {
  openMemberProfile?: boolean;
};

export type ConsumerSpaceWidgetPage =
  | 'consumerBooking'
  | 'consumerPass'
  | 'consumerInvoice'
  | 'consumerProfile'
  | 'consumerSubscription';

export type ConsumerSpaceWidgetConfig = {
  loginSubtitle?: string;
  loginTitle?: string;
  showSubtitle?: boolean;
  showTitle?: boolean;
  hideNavigation?: boolean;
  defaultPage?: ConsumerSpaceWidgetPage;
};

export type MarketplaceComponentConfig = {
  calendar?: MarketplaceCalendarData;
  workshop?: MarketplaceWorkshopData;
  privateService?: MarketplacePrivateServiceData;
  pass?: MarketplacePassData;
  vod?: {};
  subscription?: {};
  shop?: {};
  playlist?: MarketplacePlaylistData;
  loginButton?: MarketplaceLoginButtonWidgetConfig;
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
  dialogMode: 0 | 1 | 2;
  language?: string;
  widgetType: string;
  config: MarketplaceComponentConfig;
  showFab: boolean;
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
export enum MarketplacePage {
  AUTHENTICATION = 'authentication',
  COMMON = 'common', // made for common components across marketplace
  CALENDAR = 'calendar',
  WORKSHOP = 'workshop',
  PASS = 'pass',
  SUBSCRIPTION = 'subscription',
  BASKET = 'basket',
  BOOKING_PAGE = 'bookingPage',
  SPOT_SCHEDULING = 'spot_scheduling',
  CHECKOUT_CONFIRMATION = 'checkoutConfirmationPage',
  FABRIQUE = 'fabrique',
  MARKETING = 'marketing',
  CONSUMER_SPACE = 'consumer_space',
  REFERRAL_DETAILS = 'referral_details',
}

export type VariationConfigurationChoice = {
  label: string;
  value: string;
};

export type VariantionConfiguration = {
  label: string;
  choices: VariationConfigurationChoice[];
  default: VariationConfigurationChoice;
};

export type MarketplaceCSSComponentConfig = {
  label: CssComponentsVariantIdentifiers;
  css: string;
  pages: MarketplacePage[];
  showAsFlex?: boolean;
  defaultState: any;
  variations: VariantionConfiguration[];
};

export type MarketplaceCSSConfiguration = {
  id: number | null;
  udpated_at: string | null;
  apply_on_marketplace: boolean;
  components_css: Record<string, string>;
};

export type ExportableComponentsState = {
  customCss: MarketplaceCSSConfiguration;
} & ErrorAndLoading;

export type CssComponentsVariantIdentifiersValues =
  (typeof CssComponentsVariantIdentifiers)[keyof typeof CssComponentsVariantIdentifiers];

export type CSSComponentPreviews = Record<
  CssComponentsVariantIdentifiersValues,
  FC<unknown>
>;
