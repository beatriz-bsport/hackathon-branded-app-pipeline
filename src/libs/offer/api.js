// @flow
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

export async function fetchAllEvents(params: *) {
  return getAuth(`${API_V1_URI}/offer/minimal/${buildUrlParams(params)}`);
}

export async function fetchOffersByDay(params: *) {
  return getAuth(`${API_V1_URI}/offer/as_manager/${buildUrlParams(params)}`);
}

export async function fetchOffersList(params: *) {
  return getAuth(`${API_V1_URI}/offer/${buildUrlParams(params)}`);
}

export async function editLiveOffer({
  offerId,
  data,
}: {
  offerId: number,
  data: *,
}) {
  return putAuth(`${API_URI}/saas/offer/${offerId}/edit`, data);
}

export async function fetchSimilarOffers(offerId: number, params: any) {
  return getAuth(
    `${API_V1_URI}/offer/${offerId}/similars/${buildUrlParams(params || {})}`,
  );
}

export async function fetchCompatiblePacks(offerId: number) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/compatible-packs/`);
}

export async function fetchById(offerId: number) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/`);
}

export async function disableOffer({
  offerId,
  notify,
  cashback,
  deleteAll,
}: {
  offerId: number,
  notify: ?boolean,
  cashback: ?boolean,
  deleteAll: ?boolean,
}) {
  return patchAuth(`${API_URI}/saas/offer/${offerId}/disable/`, {
    available: false,
    notify,
    cashback,
    deleteAll,
  });
}

export async function deleteOffer(offerId: number, data: *) {
  return deleteAuth(`${API_URI}/saas/offer/${offerId}/disable/`, data || {});
}

export const isRegistered = async (offerId: number) => {
  return getAuth(`${API_V1_URI}/offer/${offerId}/is_registered/`);
};

export async function retrieveOffer(offerId: number) {
  return getAuth(`${API_V1_URI}/offer/${offerId}/?with_full=true`);
}

export async function massDisableOffer(
  {
    start,
    end,
  }: {
    start: string,
    end: string,
  },
  filters: any,
) {
  return postAuth(
    `${API_V1_URI}/offer/mass_disable/${buildUrlParams(filters)}`,
    { start, end },
  );
}

export async function toogleWaitingListFreeze(
  offerId: number,
  is_freezed: boolean,
) {
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
