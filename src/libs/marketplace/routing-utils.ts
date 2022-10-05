import moment from 'moment-timezone';
import { buildUrlParams } from '../../http';
import {
  MARKETPLACE_PATH_TAB_CALENDAR,
  MARKETPLACE_PATH_TAB_CALENDAR_V2,
  MARKETPLACE_PATH_TAB_PASS,
  MARKETPLACE_PATH_TAB_VOD,
  MARKETPLACE_PATH_TAB_CONTRACT,
  MARKETPLACE_PATH_TAB_WORKSHOP,
  MARKETPLACE_PATH_TAB_PRIVATE_SERVICE,
  MARKETPLACE_PATH_TAB_SHOP,
  MARKETPLACE_PATH_TAB_GIFTCARD,
} from './constants';

export const getMarketplaceRoute = (
  companyName: string,
  companyId: number,
  tab?: string,
) => {
  return `/m/${encodeURI(companyName)}/${companyId}/${tab || ''}`;
};

export const fromConfigToUrl = (
  tabConfig: {
    component_type: string;
    config: any;
  },
  queryParams: any = {},
) => {
  const query = { ...queryParams };

  const component_type = tabConfig?.component_type || '';
  let path = '';

  if (component_type === 'privateService' && tabConfig.config.privateService) {
    const privateServiceConf = tabConfig.config.privateService;

    path = MARKETPLACE_PATH_TAB_PRIVATE_SERVICE;

    let typeValue = privateServiceConf.type;

    if (!typeValue) {
      if (typeof privateServiceConf.serviceId === 'number') {
        typeValue = 'detail';
      } else {
        typeValue = 'list';
      }
    }

    if (
      typeValue === 'detail' &&
      typeof privateServiceConf.serviceId === 'number'
    ) {
      path = `${MARKETPLACE_PATH_TAB_PRIVATE_SERVICE}/${privateServiceConf.serviceId}`;
    } else if (
      privateServiceConf.privateGroups &&
      privateServiceConf.privateGroups.length
    ) {
      query.private_service_group = privateServiceConf.privateGroups.join(',');
    }
  } else if (component_type === 'playlist' && tabConfig.config.playlist) {
    path = `vod/playlist/${tabConfig.config.playlist.playlistId}`;
  } else if (component_type === 'workshop') {
    let conf: any = tabConfig.config.calendar;

    if (component_type === 'workshop') {
      if (tabConfig.config.workshop) {
        conf = tabConfig.config.workshop;
      }
      path = MARKETPLACE_PATH_TAB_WORKSHOP;
    }

    conf.metaActivities &&
      conf.metaActivities.length &&
      Object.assign(query, { activity__in: conf.metaActivities.join(',') });
    conf.coaches &&
      conf.coaches.length &&
      Object.assign(query, { coaches: conf.coaches.join(',') });
    conf.establishmentGroups &&
      conf.establishmentGroups.length &&
      Object.assign(query, {
        establishment_group__in: conf.establishmentGroups.join(','),
      });
    conf.establishments &&
      conf.establishments.length &&
      Object.assign(query, {
        establishments: conf.establishments.join(','),
      });
    conf.levels &&
      conf.levels.length &&
      Object.assign(query, { levels: conf.levels.join(',') });
  } else if (component_type === 'calendar') {
    if (tabConfig.config?.calendar?.todayOnly) {
      Object.assign(query, {
        ...query,
        onlyDay: true,
        date: moment().format('YYYY-MM-DD'),
      });
    }
    if (tabConfig.config?.calendar) {
      const conf = tabConfig.config.calendar;
      conf.metaActivities &&
        conf.metaActivities.length &&
        Object.assign(query, { activity__in: conf.metaActivities.join(',') });
      conf.coaches &&
        conf.coaches.length &&
        Object.assign(query, { coaches: conf.coaches.join(',') });
      conf.establishmentGroups &&
        conf.establishmentGroups.length &&
        Object.assign(query, {
          establishment_group__in: conf.establishmentGroups.join(','),
        });
      conf.establishments &&
        conf.establishments.length &&
        Object.assign(query, {
          establishments: conf.establishments.join(','),
        });
      conf.levels &&
        conf.levels.length &&
        Object.assign(query, { levels: conf.levels.join(',') });
    }
    path = MARKETPLACE_PATH_TAB_CALENDAR;
  } else if (component_type === 'calendarV2') {
    if (tabConfig.config?.calendarV2?.todayOnly) {
      Object.assign(query, {
        ...query,
        onlyDay: true,
        date: moment().format('YYYY-MM-DD'),
      });
    }
    if (tabConfig.config?.calendarV2) {
      const conf = tabConfig.config.calendarV2;
      conf.metaActivities &&
        conf.metaActivities.length &&
        Object.assign(query, { activity__in: conf.metaActivities.join(',') });
      conf.coaches &&
        conf.coaches.length &&
        Object.assign(query, { coaches: conf.coaches.join(',') });
      conf.establishmentGroups &&
        conf.establishmentGroups.length &&
        Object.assign(query, {
          establishment_group__in: conf.establishmentGroups.join(','),
        });
      conf.establishments &&
        conf.establishments.length &&
        Object.assign(query, {
          establishments: conf.establishments.join(','),
        });
      conf.levels &&
        conf.levels.length &&
        Object.assign(query, { levels: conf.levels.join(',') });
      if (conf.compactMode) {
        Object.assign(query, { compactMode: conf.compactMode });
      }
      if (conf.variant) {
        Object.assign(query, { variant: conf.variant });
      }
      if (conf.groupSessionByPeriod === false) {
        Object.assign(query, {
          groupSessionByPeriod: conf.groupSessionByPeriod,
        });
      }
    }
    path = MARKETPLACE_PATH_TAB_CALENDAR_V2;
  } else if (component_type === 'pass') {
    path = MARKETPLACE_PATH_TAB_PASS;
    Object.assign(query, tabConfig.config.pass);
  } else if (component_type === 'subscription') {
    path = MARKETPLACE_PATH_TAB_CONTRACT;
  } else if (component_type === 'shop') {
    path = MARKETPLACE_PATH_TAB_SHOP;
  } else if (component_type === 'vod') {
    path = MARKETPLACE_PATH_TAB_VOD;
    if (tabConfig?.config?.vod?.videoId) {
      path = `vod/video/${tabConfig.config.vod.videoId}`;
    }
  } else if (component_type === 'giftcard') {
    path = MARKETPLACE_PATH_TAB_GIFTCARD;
    const conf = tabConfig.config.giftcard || {};
    conf.giftcards &&
      conf.giftcards.length &&
      Object.assign(query, {
        giftcards: conf.giftcards.join(','),
      });
  } else {
    return '';
  }
  return `${path}/${buildUrlParams(query)}`;
};

export const generateMarketPlaceCustomFormLink = (
  companyName: string,
  companyId: number,
  customFormId: number,
) => {
  return `${window.location.origin}${getMarketplaceRoute(
    companyName,
    companyId,
  )}form/${customFormId}`;
};
