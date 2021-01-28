import { buildUrlParams } from '../../http';
import {
  MarketplaceCommonFilter,
  MarketplaceComponentConfig,
  MarketplaceComponentsEnum,
  PrivateServicePageTypeEnum,
  WidgetComponentsEnum,
} from '../../libs/marketplace/types';

export const getMarketplaceRoute = (
  companyName: string,
  companyId: number,
  tab?: string,
) => {
  const company = (companyName || '-').replace(/ /g, '-');
  return `/m/${company}/${companyId}/${tab || ''}`;
};

export const fromConfigToUrl = (
  tabConfig: {
    component_type: MarketplaceComponentsEnum | WidgetComponentsEnum;
    config: MarketplaceComponentConfig;
  },
  queryParams: any = {},
) => {
  const query = { ...queryParams };

  const { component_type } = tabConfig;
  let path = '';

  if (component_type === 'privateService' && tabConfig.config.privateService) {
    const privateServiceConf = tabConfig.config.privateService;

    path = 'private-service';

    let typeValue = privateServiceConf.type;

    if (!typeValue) {
      if (typeof privateServiceConf.serviceId === 'number') {
        typeValue = PrivateServicePageTypeEnum.detail;
      } else {
        typeValue = PrivateServicePageTypeEnum.list;
      }
    }

    if (
      typeValue === PrivateServicePageTypeEnum.detail &&
      typeof privateServiceConf.serviceId === 'number'
    ) {
      path = `private-service/${privateServiceConf.serviceId}`;
    } else if (
      privateServiceConf.privateGroups &&
      privateServiceConf.privateGroups.length
    ) {
      query.private_service_group = privateServiceConf.privateGroups.join(',');
    }
  }

  if (component_type === 'playlist' && tabConfig.config.playlist) {
    path = `vod/playlist/${tabConfig.config.playlist.playlistId}`;
  }

  if (['calendar', 'workshop'].includes(component_type)) {
    let conf: MarketplaceCommonFilter = tabConfig.config.calendar;

    if (component_type === 'workshop' && tabConfig.config.workshop) {
      conf = tabConfig.config.workshop;
    }

    conf.metaActivities &&
      conf.metaActivities.length &&
      Object.assign(query, { activity__in: conf.metaActivities.join(',') });
    conf.coaches &&
      conf.coaches.length &&
      Object.assign(query, { coaches: conf.coaches.join(',') });
    conf.establishments &&
      conf.establishments.length &&
      Object.assign(query, {
        establishments: conf.establishments.join(','),
      });
    conf.levels &&
      conf.levels.length &&
      Object.assign(query, { levels: conf.levels.join(',') });
  }

  if (component_type === 'calendar' && tabConfig.config.calendar) {
    path = 'calendar';
  }
  if (component_type === 'workshop') {
    path = 'workshop';
  }
  if (component_type === 'pass') {
    path = 'pass';
  }
  if (component_type === 'subscription') {
    path = 'subscription';
  }
  if (component_type === 'shop') {
    path = 'shop';
  }
  if (component_type === 'vod') {
    path = 'vod';
  }
  return `${path}/${buildUrlParams(query)}`;
};
