/**
 * The available components we can use in the marketplace
 */
export enum MarketplaceComponentsEnum {
  'calendar' = 'calendar',
  'workshop' = 'workshop',
  'privateService' = 'privateService',
  'pass' = 'pass',
  'vod' = 'vod',
  'subscription' = 'subscription',
  'shop' = 'shop',
  'playlist' = 'playlist',
}

export enum WidgetComponentsEnum {
  'calendar' = 'calendar',
  'workshop' = 'workshop',
  'privateService' = 'privateService',
  'vod' = 'vod',
  'playlist' = 'playlist',
  'newsletter' = 'newsletter',
}

export enum PrivateServicePageTypeEnum {
  'list' = 'list',
  'detail' = 'detail',
}

export type MarketplaceCommonFilter = {
  coaches?: number[];
  establishments?: number[];
  metaActivities?: number[];
  levels?: number[];
};

export type MarketplaceCalendarData = MarketplaceCommonFilter & {
  compactMode: true | false | null;
};

export type MarketplaceWorkshopData = MarketplaceCommonFilter;

export type MarketplacePrivateServiceData = {
  type: PrivateServicePageTypeEnum;
  serviceId?: number | null;
  privateGroups?: number[] | null;
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
  pass?: {};
  vod?: {};
  subscription?: {};
  shop?: {};
  playlist?: MarketplacePlaylistData;
};

export type MarketplaceTabConfig = {
  component_type: MarketplaceComponentsEnum;
  title: string;
  index: number;
  config: MarketplaceComponentConfig;
};

export type WidgetConfig = {
  parentElement: string;
  companyId: number;
  widgetType: WidgetComponentsEnum;
  config: MarketplaceComponentConfig;
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
