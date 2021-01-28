import {
  MarketplaceComponentsEnum,
  MarketplaceSettings,
  PrivateServicePageTypeEnum,
} from './types';

export const MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT: any = {
  calendar: {
    coaches: [],
    establishments: [],
    metaActivities: [],
    levels: [],
  },
  workshop: {
    coaches: [],
    establishments: [],
    metaActivities: [],
    levels: [],
  },
  privateService: {
    type: PrivateServicePageTypeEnum.list,
  },
  playlist: {},
  pass: {},
  vod: {
    videoId: null,
  },
  subscription: {},
  shop: {},
  newsletter: {},
};

export const MARKETPLACE_DEFAULT_CONFIG: MarketplaceSettings['config'] = [
  {
    component_type: MarketplaceComponentsEnum.calendar,
    title: '',
    index: 0,
    config: {
      calendar: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.calendar,
    },
  },
  {
    component_type: MarketplaceComponentsEnum.workshop,
    title: '',
    index: 1,
    config: {
      workshop: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.workshop,
    },
  },
  {
    component_type: MarketplaceComponentsEnum.privateService,
    title: '',
    index: 2,
    config: {
      privateService: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.privateService,
    },
  },
  {
    component_type: MarketplaceComponentsEnum.pass,
    title: '',
    index: 3,
    config: {
      pass: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.pass,
    },
  },
  {
    component_type: MarketplaceComponentsEnum.vod,
    title: '',
    index: 4,
    config: {
      vod: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.vod,
    },
  },
  {
    component_type: MarketplaceComponentsEnum.subscription,
    title: '',
    index: 5,
    config: {
      subscription: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.subscription,
    },
  },
  {
    component_type: MarketplaceComponentsEnum.shop,
    title: '',
    index: 6,
    config: {
      shop: MARKETPLACE_DEFAULT_CONFIG_BY_COMPONENT.shop,
    },
  },
];
