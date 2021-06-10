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
import { OfferFilterData } from './types';

export async function fetchAllEvents(params: any) {
  return getAuth(`${API_V1_URI}/offer/minimal/${buildUrlParams(params)}`);
}

export async function fetchOffersByDay(params: any) {
  return getAuth(`${API_V1_URI}/offer/as_manager/${buildUrlParams(params)}`);
}

export async function fetchOffersList(
  params: {
    company: number;
    min_date: string;
    max_date: string;
    available?: boolean;
    is_workshop?: boolean;
  } & OfferFilterData,
) {
  return getAuth(`${API_V1_URI}/offer/${buildUrlParams(params)}`);
}

export async function editLiveOffer({
  offerId,
  data,
}: {
  offerId: number;
  data: any;
}) {
  return putAuth(`${API_URI}/saas/offer/${offerId}/edit`, data);
}

export async function fetchSimilarOffers(offerId: number, params: any) {
  return getAuth(
    `${API_V1_URI}/offer/${offerId}/similars/${buildUrlParams(params || {})}`,
  );
}

export async function fetchOfferStatus(offerId: number, params: any = {}) {
  return getAuth(
    `${API_V1_URI}/offer/${offerId}/bookable_status/${buildUrlParams(params)}`,
  );
}

export async function fetchOfferStatusList(
  id__in: Array<number>,
  params: any = {},
) {
  return getAuth(
    `${API_V1_URI}/offer/bookable_status_list/${buildUrlParams({
      id__in,
      ...params,
    })}`,
  );
}

export async function postUserRegistration(data: {
  consumer_payment_pack?: number;
  payment_pack?: number;
  payment_combo?: number;
  email?: string;
  offers: Array<{ offer_id: number; extra_data: any }>;
}) {
  return postAuth(` ${API_V1_URI}/offer/user_registration/`, data);
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
  custom_selection,
  custom_selection_ids,
}: {
  offerId: number;
  notify?: boolean;
  cashback?: boolean;
  deleteAll?: boolean;
  custom_selection?: boolean;
  custom_selection_ids?: Array<number>;
}) {
  return patchAuth(`${API_URI}/saas/offer/${offerId}/disable/`, {
    available: false,
    notify,
    cashback,
    deleteAll,
    custom_selection,
    custom_selection_ids,
  });
}

export async function deleteOffer(offerId: number, data: any) {
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
    start: string;
    end: string;
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

export async function restoreOffer(offerId: number) {
  return putAuth(`${API_V1_URI}/offer/${offerId}/restore/`);
}

export async function fetchBookedGender(params: any) {
  return getAuth(`${API_V1_URI}/offer/booked_gender/${buildUrlParams(params)}`);
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
  fetchBookedGender,
  fetchOfferStatus,
};
