import {
  API_URI,
  API_V1_URI,
  getAuth,
  putAuth,
  deleteAuth,
  patchAuth,
} from '../http';

export async function fetchAllEvents() {
  return getAuth(`${API_URI}/saas/offers/minimal`);
}

export async function fetchOffersByDay({ year, month, day }) {
  return getAuth(`${API_URI}/saas/offers/${year}/${month}/${day}`);
}

export async function editLiveOffer({ offerId, data }) {
  return putAuth(`${API_URI}/saas/offer/${offerId}/edit`, data);
}

export async function fetchSimilarOffers(offerId) {
  return getAuth(`${API_V1_URI}/offer/${offerId}/similars/`);
}

export async function fetchCompatiblePacks(offerId) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/compatible-packs/`);
}

export async function fetchById(offerId) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/`);
}

export async function disableOffer({ offerId, notify, cashback, deleteAll }) {
  return patchAuth(`${API_URI}/saas/offer/${offerId}/disable/`, {
    available: false,
    notify,
    cashback,
    deleteAll,
  });
}

export async function deleteOffer(offerId, data) {
  return deleteAuth(`${API_URI}/saas/offer/${offerId}/disable/`, data || {});
}

export default {
  fetchAllEvents,
  editLiveOffer,
  fetchCompatiblePacks,
  disableOffer,
  delete: deleteOffer,
  fetchOffersByDay,
  fetchSimilarOffers,
  fetchById,
};
