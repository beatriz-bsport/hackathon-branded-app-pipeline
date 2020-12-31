import { API_URI, API_V1_URI, get, getAuth, patchAuth } from '../../http';

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

const fetchPaymentPacks = async ({
  companyId,
  page,
}: {
  companyId: string;
  page: number;
}) => {
  return getAuth(
    `${API_V1_URI}/payment-pack/payment-pack/?company=${companyId}&page=${page}&manager_only=false&disabled=false&as_consumer=true`,
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
  return getAuth(`${API_V1_URI}/marketplace_settings/settings/${companyId}/`);
};

export const updateMarketplaceSettings = async (
  companyId: string,
  data: any,
) => {
  return patchAuth(
    `${API_V1_URI}/marketplace_settings/settings/${companyId}/`,
    data,
  );
};

export default {
  fetchCompanyMetaActivities,
  fetchCompanyEstablishments,
  fetchCompanyCoaches,
  fetchCompanyOffers,
  fetchCompany,
  fetchPaymentPacks,
};
