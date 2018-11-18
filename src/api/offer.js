import { API_URI, getAuth, putAuth } from '../http';

export async function fetchAllEvents() {
  return getAuth(`${API_URI}/saas/offers/minimal`);
}

export async function editLiveOffer({ offerId, data }) {
  return putAuth(`${API_URI}/saas/offer/${offerId}/edit`, data);
}

export async function fetchCompatiblePacks(offerId) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/compatible-packs/`);
}

export async function disableOffer(offerId) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/disable/`);
}

export default {
  fetchAllEvents,
  editLiveOffer,
  fetchCompatiblePacks,
  disableOffer,
};
