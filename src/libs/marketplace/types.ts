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

export type MarketplaceCalendarData = {
  coaches: { id: string, name: string }[];
  establishments: { id: string, name: string }[];
  metaActivities: { id: string, name: string }[];
  levels: { id: string, name: string }[];
};

export type MarketplacePrivateServiceData = { serviceId?: string, name?: string };
export type MarketplacePlaylistData = { playlistId: string, name: string };

export type MarketplaceComponentData = MarketplaceCalendarData |
  MarketplacePrivateServiceData |
  MarketplacePlaylistData |
  {}

export type MarketplaceTabConfig = {
  componentType: MarketplaceComponentsEnum;
  title: string;
  data: MarketplaceComponentData;
}

export type MarketplaceConfig = {
  custom?: boolean
  tabs: MarketplaceTabConfig[]
}

export type MarketplaceSettings = {
  company: number,
  id: number,
  config: MarketplaceConfig
}

export type MarketplaceSettingState = {
  loading: boolean,
  error?: Error,
  settings: MarketplaceSettings,
};
