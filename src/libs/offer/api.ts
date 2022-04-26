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
import { Offer, OfferFilterData } from './types';

export async function createOffers(data: Offer) {
  return postAuth(`${API_V1_URI}/offer/create_similar_offers/`, data);
}

export async function editOffers({
  offerId,
  data,
}: {
  offerId: number;
  data: Offer;
}) {
  return putAuth(`${API_V1_URI}/offer/${offerId}/`, data);
}

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
    only_future?: boolean;
  } & OfferFilterData,
) {
  return getAuth(`${API_V1_URI}/offer/${buildUrlParams(params)}`);
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
  force,
}: {
  offerId: number;
  notify?: boolean;
  cashback?: boolean;
  deleteAll?: boolean;
  custom_selection?: boolean;
  custom_selection_ids?: Array<number>;
  force: boolean;
}) {
  return patchAuth(`${API_URI}/saas/offer/${offerId}/disable/`, {
    available: false,
    notify,
    cashback,
    deleteAll,
    custom_selection,
    custom_selection_ids,
    force,
  });
}

export async function deleteOffer(offerId: number, data: any) {
  return deleteAuth(`${API_URI}/saas/offer/${offerId}/disable/`, data || {});
}

export const isRegistered = async (offerId: number) => {
  return getAuth(`${API_V1_URI}/offer/${offerId}/is_registered/`);
};

export const userRegistration = async () => {
  return getAuth(`${API_V1_URI}/offer/registered/`);
};

export async function retrieveOffer(offerId: number) {
  return getAuth(
    `${API_V1_URI}/offer/${offerId}/?with_full=true&with_tags_status=true`,
  );
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

export async function toggleWaitingListFreeze(
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
export async function fetchNumberOfMassDisabledOfferAPI(params: {
  start: string;
  end: string;
}) {
  return getAuth(
    `${API_V1_URI}/offer/number_of_mass_disable_offer/${buildUrlParams(
      params,
    )}`,
  );
}

export async function checkOfferTagEligibility(
  offerId: number,
  data?: { member_id?: number },
) {
  return postAuth(
    `${API_V1_URI}/offer/${offerId}/check_tags_eligibility/`,
    data,
  );
}

export async function unTagAllOffers(params: {
  tag_id: number;
  from_whitelist: boolean;
  from_blacklist: boolean;
}) {
  return postAuth(`${API_V1_URI}/offer/delete_tag_from_all_offers/`, {
    ...params,
  });
}
export async function unTagOffer(params: { offer_id: number; tag_id: number }) {
  return postAuth(
    `${API_V1_URI}/offer/${params.offer_id}/delete_tag_from_offer/`,
    {
      tag_id: params.tag_id,
    },
  );
}
export default {
  fetchAllEvents,
  fetchCompatiblePacks,
  disableOffer,
  delete: deleteOffer,
  fetchOffersByDay,
  fetchSimilarOffers,
  fetchById,
  toggleWaitingListFreeze,
  fetchOffersList,
  fetchBookedGender,
  fetchOfferStatus,
  checkOfferTagEligibility,
};
