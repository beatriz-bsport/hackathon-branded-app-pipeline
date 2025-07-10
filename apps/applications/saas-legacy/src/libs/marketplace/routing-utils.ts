import { DateTime } from 'luxon';
import { Offer } from '#src/libs/offer/types';
import { buildUrlParams } from '../../http';
import {
  MARKETPLACE_PATH_TAB_CALENDAR,
  MARKETPLACE_PATH_TAB_PASS,
  MARKETPLACE_PATH_TAB_VOD,
  MARKETPLACE_PATH_TAB_CONTRACT,
  MARKETPLACE_PATH_TAB_WORKSHOP,
  MARKETPLACE_PATH_TAB_PRIVATE_SERVICE,
  MARKETPLACE_PATH_TAB_SHOP,
  MARKETPLACE_PATH_TAB_GIFTCARD,
} from './constants';
import { getUTMParamsFromURL } from '#src/utils/urlUtils';

export const getMarketplaceRoute = (
  companyName: string,
  companyId: number,
  tab?: string,
) => {
  return `/m/${encodeURI(companyName)}/${companyId}/${tab || ''}`;
};

export const getMemberProfileRoute = (companyId: number) => {
  return `/c/${companyId}/profile/`;
};

export const fromConfigToUrl = (
  tabConfig: {
    component_type: string;
    config: any;
    configIndex: number;
  },
  queryParams: any = {},
) => {
  const query = { ...queryParams };

  const component_type = tabConfig?.component_type || '';
  let path = '';
  const calendarComponentTypes = ['calendar', 'calendarV2'];

  if (tabConfig?.configIndex !== undefined) {
    Object.assign(query, { index: tabConfig.configIndex });
  }
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
    let conf: any = tabConfig.config.calendar || {};

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
  } else if (calendarComponentTypes.includes(component_type)) {
    if (
      tabConfig.config?.calendarV2?.todayOnly ||
      tabConfig.config?.calendar?.todayOnly
    ) {
      Object.assign(query, {
        ...query,
        onlyDay: true,
        date: DateTime.now().toISODate(),
      });
    }
    if (tabConfig.config?.calendarV2 || tabConfig.config?.calendar) {
      const conf = tabConfig.config.calendarV2 || tabConfig.config.calendar;
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
    path = MARKETPLACE_PATH_TAB_CALENDAR;
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
    conf?.giftcards?.length &&
      Object.assign(query, {
        giftcards: conf?.giftcards?.join(',') || '',
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

/**
 * A function that returns the default route for the new member profile
 * @param companyId The company id
 * @returns {string}
 */
export const getUserSpaceUrl = (companyId: number) =>
  `/c/${companyId}/booking/`;

export const getLoginUrl = (
  companyId: number,
  pathname: string,
  search: string,
) => {
  return `/login/customer?next=${encodeURIComponent(
    `${pathname}${search || '?'}&membership=${companyId}`,
  )}&membership=${companyId}`;
};

export const getBookCalendarUrl = (offerId: number, companyId: number) => {
  return `/customer/payment/offer/${offerId}/${buildUrlParams({
    membership: companyId,
  })}`;
};

export const getBookWorkshopUrl = (
  offer: Offer | number,
  companyId: number,
) => {
  const offerId = typeof offer === 'number' ? offer : offer.id;
  return `/customer/payment/offer/${offerId}/${buildUrlParams({
    membership: companyId,
    fromWorkshop: true,
  })}`;
};

const buildFinalUrlWithParams = (
  url: string,
  params?: { [key: string]: string | number },
) => {
  let finalUrl = url;
  if (params) {
    finalUrl = `${finalUrl}${buildUrlParams(params)}`;
  }
  return finalUrl;
};

export const getContractCheckoutUrl = (
  companyId: number,
  contractId: number,
  params?: { [key: string]: string | number },
) => {
  const url = `/checkout/${companyId}/subscription/${contractId}`;
  return buildFinalUrlWithParams(url, params);
};

export const getBoutiqueContractCheckoutUrl = (
  companyId: number,
  contractId: number,
  params?: { [key: string]: string | number },
) => {
  const url = `/contract-s/${companyId}/${contractId}`;
  return buildFinalUrlWithParams(url, params);
};

export const getCheckoutUrl = (
  companyId: number,
  params?: { [key: string]: string | number },
) => {
  const utmParams = getUTMParamsFromURL();
  const checkoutUrl = `/checkout-s/${companyId}`;

  return buildFinalUrlWithParams(checkoutUrl, { ...params, ...utmParams });
};

export const getOneClickBookingUrl = (
  companyId: number,
  offerId: number,
  locationSearch?: string,
) => {
  const oneClickBookingUrl = `/one-click-booking/${companyId}/${offerId}`;
  if (locationSearch) {
    return `${oneClickBookingUrl}${locationSearch}`;
  }
  return oneClickBookingUrl;
};

export const getOfferBookerUrl = (
  companyId: number,
  offerId: number,
  locationSearch?: string,
) => {
  const pricingPageUrl = `/booker-module-s/${companyId}/${offerId}`;
  if (locationSearch) {
    return `${pricingPageUrl}${locationSearch}`;
  }
  return pricingPageUrl;
};

export const getPassExpressCheckoutUrl = (
  companyId: number,
  passId: number,
  passType: string,
  locationSearch?: string,
) => {
  const passCheckoutUrl = `/pass-express-checkout/${companyId}/${passId}/${passType}`;
  if (locationSearch) {
    return `${passCheckoutUrl}${locationSearch}`;
  }
  return passCheckoutUrl;
};

export const getCheckoutValidationUrl = (
  companyId: number,
  params?: { [key: string]: string | number },
) => {
  const validationUrl = `/checkout-s/${companyId}/validation`;

  return buildFinalUrlWithParams(validationUrl, params);
};

export const getSubscriptionValidationUrl = (
  companyId: number,
  contractId: number,
  params?: { [key: string]: string | number },
) =>
  buildFinalUrlWithParams(
    `/checkout/${companyId}/subscription/${contractId}/validation`,
    params,
  );

/**
 * Checks if the next URL indicates a booking flow.
 *
 * @param {string} urlNext - The URL to check for booking flow indicators.
 * @returns {boolean} - True if the URL indicates a booking flow, otherwise false.
 * NB : This is implemented as a "hot-feature" and further development must be done
 * to avoid keeping this ugly implementation
 */
export const isBookingFlowNext = (urlNext: string): boolean =>
  !!urlNext?.includes('/booker-module-s/') ||
  !!urlNext?.includes('/private-slot-booker/');
