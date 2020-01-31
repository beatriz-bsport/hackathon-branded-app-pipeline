import {
  API_URI,
  API_V1_URI,
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';

export async function fetchAllEvents(params) {
  return getAuth(`${API_V1_URI}/offer/minimal${buildUrlParams(params)}`);
}

export async function fetchOffersByDay(params) {
  return getAuth(`${API_V1_URI}/offer/as_manager/${buildUrlParams(params)}`);
}

export async function fetchOffersList(params) {
  return getAuth(`${API_V1_URI}/offer/${buildUrlParams(params)}`);
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

export async function retrieveOffer(offerId) {
  return getAuth(`${API_V1_URI}/offer/${offerId}/?with_full=true`);
}

export async function toogleWaitingListFreeze(offerId, is_freezed) {
  return postAuth(
    `${API_V1_URI}/offer/${offerId}/toogle_waiting_list_freeze/`,
    {
      is_freezed,
    },
  );
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
  toogleWaitingListFreeze,
  fetchOffersList,
};
