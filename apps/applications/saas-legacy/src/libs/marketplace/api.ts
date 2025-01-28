import { AxiosResponse } from 'axios';
import {
  buildUrlParams,
  get,
  getAuth,
  patchAuth,
  patchAuthDeprecated,
} from '../../http';
import type {
  BookingFunnelConfiguration,
  MarketplaceSettings,
  PricingOptionOrdering,
} from './types';

import Config from '../../config';

const API_V1_URI_BOOK = Config.REACT_APP_BASE_URI_BOOK_V1;
const API_V1_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V1;
const API_V1_URI_CORE = Config.REACT_APP_BASE_URI_CORE_V1;
const API_V1_URI_MEMBER_EXPERIENCE =
  Config.REACT_APP_BASE_URI_MEMBER_EXPERIENCE_V1;

const fetchCompanyMetaActivities = async ({
  companyId,
  page,
  page_size = 300,
}: {
  companyId: string;
  page: number;
  page_size: number;
}) => {
  return get(
    `${API_V1_URI_BOOK}/meta-activity/?company=${companyId}&page_size=${page_size}&page=${page}`,
  );
};

const fetchPaymentPacksAsConsumer = async ({
  companyId,
  page,
}: {
  companyId: string;
  page: number;
}) => {
  return getAuth(
    `${API_V1_URI_BUYABLE}/payment-pack/payment-pack/${buildUrlParams({
      company: companyId,
      page,
      manager_only: false,
      disabled: false,
      as_consumer: true,
    })}`,
  );
};

const fetchCompanyEstablishments = async ({
  companyId,
  page,
}: {
  companyId: string;
  page: number;
}) => {
  return get(
    `${API_V1_URI_CORE}/establishment/?company=${companyId}&page=${page}`,
  );
};

const fetchCompanyCoaches = async ({
  companyId,
  page,
}: {
  companyId: string;
  page: number;
}) => {
  return get(
    `${API_V1_URI_CORE}/coach/?company=${companyId}&page=${page}&disabled=false`,
  );
};
const fetchCompanyOffers = async ({
  companyId,
  min_date,
  max_date,
  is_workshop,
  page,
  page_size = 300,
}: {
  companyId: string;
  page: number;
  min_date: string;
  max_date: string;
  is_workshop: boolean;
  page_size: number;
}) => {
  return get(
    `${API_V1_URI_BOOK}/offer/?company=${companyId}&min_date=${min_date}&is_workshop=${is_workshop}&max_date=${max_date}&page=${page}&page_size=${page_size}`,
  );
};

export const fetchMarketplaceSettings = (companyId: string) => {
  return getAuth<MarketplaceSettings>(
    `${API_V1_URI_MEMBER_EXPERIENCE}/marketplace_settings/configuration/${companyId}/`,
  );
};

export const updateMarketplaceSettings = async (
  companyId: string,
  data: any,
) => {
  return patchAuthDeprecated(
    `${API_V1_URI_MEMBER_EXPERIENCE}/marketplace_settings/configuration/${companyId}/`,
    data,
  );
};

export const fetchBookingFunnelConfiguration: (
  companyId: number,
) => Promise<AxiosResponse<BookingFunnelConfiguration>> = (companyId) => {
  return getAuth(
    `${API_V1_URI_MEMBER_EXPERIENCE}/marketplace_settings/booking_funnel_configuration/company/${companyId}/`,
  );
};

export const updateBookingFunnelConfiguration: (
  companyId: number,
  data: {
    custom_pricing_option_ordering_enabled: boolean;
    custom_pricing_option_ordering?: PricingOptionOrdering;
  },
) => Promise<AxiosResponse<BookingFunnelConfiguration>> = (companyId, data) => {
  return patchAuth(
    `${API_V1_URI_MEMBER_EXPERIENCE}/marketplace_settings/booking_funnel_configuration/company/${companyId}/`,
    data,
  );
};

export default {
  fetchCompanyMetaActivities,
  fetchCompanyEstablishments,
  fetchCompanyCoaches,
  fetchCompanyOffers,
  fetchPaymentPacksAsConsumer,
};
