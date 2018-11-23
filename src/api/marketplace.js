import { API_URI, get } from '../http';

export async function fetchCompany(companyId) {
  return get(`${API_URI}/marketplace/company/${companyId}/summary`);
}

export async function fetchCalendar(companyId) {
  return get(`${API_URI}/marketplace/company/${companyId}/offers`);
}

export async function fetchOffersByDay({ companyId, year, month, day }) {
  return get(
    `${API_URI}/marketplace/company/${companyId}/offers/${year}/${month}/${day}`,
  );
}

export async function fetchPaymentPacks(companyId) {
  return get(`${API_URI}/marketplace/company/${companyId}/payment-packs`);
}

export async function getIdByName(companyName) {
  return get(`${API_URI}/marketplace/${companyName}`);
}

export default {
  fetchCompany,
  fetchCalendar,
  fetchOffersByDay,
  fetchPaymentPacks,
  getIdByName,
};
