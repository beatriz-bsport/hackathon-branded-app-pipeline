import { API_V1_URI, getAuth } from '../../http';

const fetchCompanyMetaActivities = async ({
  companyId,
  page,
  page_size = 300,
}) => {
  return getAuth(
    `${API_V1_URI}/meta-activity/?company=${companyId}&page_size=${page_size}&page=${page}`,
  );
};

const fetchCompanyActivities = async ({ companyId, page }) => {
  return getAuth(`${API_V1_URI}/activity/?company=${companyId}&page=${page}`);
};

const fetchCompanyEstablishments = async ({ companyId, page }) => {
  return getAuth(
    `${API_V1_URI}/establishment/?company=${companyId}&page=${page}`,
  );
};

const fetchCompanyCoaches = async ({ companyId, page }) => {
  return getAuth(`${API_V1_URI}/coach/?company=${companyId}&page=${page}`);
};
const fetchCompanyOffers = async ({
  companyId,
  min_date,
  max_date,
  page,
  page_size = 300,
}) => {
  return getAuth(
    `${API_V1_URI}/offer/?available=true&company=${companyId}&min_date=${min_date}&max_date=${max_date}&page=${page}&page_size=${page_size}`,
  );
};

export default {
  fetchCompanyMetaActivities,
  fetchCompanyActivities,
  fetchCompanyEstablishments,
  fetchCompanyCoaches,
  fetchCompanyOffers,
};
