/**
 * The available components we can use in the marketplace
 */

import { ErrorAndLoading } from '#libs/types';

export type MarketplaceCommonFilter = {
  coaches?: number[];
  establishments?: number[];
  metaActivities?: number[];
  levels?: number[];
  establishmentGroups?: number[];
};

export type MarketplaceCalendarData = MarketplaceCommonFilter & {
  compactMode: true | false | null;
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

export type MarketplaceComponentConfig = {
  calendar?: MarketplaceCalendarData;
  workshop?: MarketplaceWorkshopData;
  privateService?: MarketplacePrivateServiceData;
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
  CALENDAR = 'calendar',
  WORKSHIP = 'workshop',
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
  label: string;
  css: string;
  pages: MarketplacePage[];
  showAsFlex?: boolean;
  defaultState: any;
  variations: VariantionConfiguration[];
};

export type MarketplaceCSSConfiguration = {
  id: number | null;
  udpated_at: string | null;
  components_css: Record<string, string>;
};

export type ExportableComponentsState = {
  customCss: MarketplaceCSSConfiguration;
} & ErrorAndLoading;
