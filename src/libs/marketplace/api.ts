import { AxiosResponse } from 'axios';
import {
  API_URI,
  API_V1_URI,
  buildUrlParams,
  get,
  getAuth,
  getAuthDeprecated,
  patchAuth,
  patchAuthDeprecated,
} from '../../http';
import { BookingFunnelConfiguration, PricingOptionOrdering } from './types';

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
    `${API_V1_URI}/meta-activity/?company=${companyId}&page_size=${page_size}&page=${page}`,
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
    `${API_V1_URI}/payment-pack/payment-pack/${buildUrlParams({
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
  return get(`${API_V1_URI}/establishment/?company=${companyId}&page=${page}`);
};

const fetchCompanyCoaches = async ({
  companyId,
  page,
}: {
  companyId: string;
  page: number;
}) => {
  return get(
    `${API_V1_URI}/coach/?company=${companyId}&page=${page}&disabled=false`,
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
    `${API_V1_URI}/offer/?company=${companyId}&min_date=${min_date}&is_workshop=${is_workshop}&max_date=${max_date}&page=${page}&page_size=${page_size}`,
  );
};

const fetchCompany = async (companyId: string) => {
  return get(`${API_URI}/marketplace/company/${companyId}/summary`);
};

export const fetchMarketplaceSettings = async (companyId: string) => {
  return getAuthDeprecated(
    `${API_V1_URI}/marketplace_settings/configuration/${companyId}/`,
  );
};

export const updateMarketplaceSettings = async (
  companyId: string,
  data: any,
) => {
  return patchAuthDeprecated(
    `${API_V1_URI}/marketplace_settings/configuration/${companyId}/`,
    data,
  );
};

export const getIdByName = async (companyName: string) => {
  return get(`${API_URI}/marketplace/${companyName}`);
};

export const fetchBookingFunnelConfiguration: (
  companyId: number,
) => Promise<AxiosResponse<BookingFunnelConfiguration>> = (companyId) => {
  return getAuth(
    `${API_V1_URI}/marketplace_settings/booking_funnel_configuration/company/${companyId}/`,
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
    `${API_V1_URI}/marketplace_settings/booking_funnel_configuration/company/${companyId}/`,
    data,
  );
};

export default {
  fetchCompanyMetaActivities,
  fetchCompanyEstablishments,
  fetchCompanyCoaches,
  fetchCompanyOffers,
  fetchCompany,
  fetchPaymentPacksAsConsumer,
};
