// @flow

import moment from 'moment-timezone';
import { buildUrlParams } from '../../http';

export const getMarketplaceRoute = (
  companyName: string,
  companyId: number,
  tab: string,
) => {
  const company = (companyName || '-').replace(/ /g, '-');
  return `/m/${company}/${companyId}/${tab || ''}`;
};

export const fromConfigToUrl = (tabConfig, queryParams: any = {}) => {
  const { componentType } = tabConfig;
  let path = '';

  if (componentType === 'privateService') {
    path = 'private-service';

    if (tabConfig.data.serviceId !== undefined) {
      path = `private-service/${tabConfig.data.serviceId}`;
    }
  }

  if (componentType === 'playlist') {
    path = `vod/playlist/${tabConfig.data.playlistId}`;
  }

  if (componentType === 'calendar') {
    path = 'calendar';
    Object.entries(tabConfig.data).forEach(([key, valueList]) => {
      if (key === 'metaActivities') {
        // eslint-disable-next-line
          queryParams['activity__in'] = valueList.map((v) => v.id).join(',');
      } else {
        // eslint-disable-next-line
          queryParams[key] = valueList.map((v) => v.id).join(',');
      }
    });

    // eslint-disable-next-line
    queryParams.date = moment().format('YYYY-MM-DD');
  }
  if (componentType === 'workshop') {
    path = 'workshop';
  }
  if (componentType === 'pass') {
    path = 'pass';
  }
  if (componentType === 'subscription') {
    path = 'subscription';
  }
  if (componentType === 'shop') {
    path = 'shop';
  }
  if (componentType === 'vod') {
    path = 'vod';
  }
  return `${path}/${buildUrlParams(queryParams)}`;
};
