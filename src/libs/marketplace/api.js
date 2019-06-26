// @flow

import { API_URI, getAuth } from '../../http';

const fetchCompanyMetaActivities = async (
  companyId: number,
  page: number = 1,
) => {
  return getAuth(`${API_URI}/meta-activity/?company=${companyId}&page=${page}`);
};

const fetchCompanyActivities = async (companyId: number, page: number = 1) => {
  return getAuth(`${API_URI}/activity/?company=${companyId}&page=${page}`);
};

const fetchCompanyEstablishments = async (
  companyId: number,
  page: number = 1,
) => {
  return getAuth(`${API_URI}/establishment/?company=${companyId}&page=${page}`);
};

const fetchCompanyCoaches = async (companyId: number, page: number = 1) => {
  return getAuth(`${API_URI}/coach/?company=${companyId}&page=${page}`);
};
const fetchCompanyOffers = async (
  companyId: number,
  page: number = 1,
  page_size: number = 300,
) => {
  return getAuth(
    `${API_URI}/offer/?company=${companyId}&page=${page}&page_size=${page_size}`,
  );
};

export default {
  fetchCompanyMetaActivities,
  fetchCompanyActivities,
  fetchCompanyEstablishments,
  fetchCompanyCoaches,
  fetchCompanyOffers,
};
