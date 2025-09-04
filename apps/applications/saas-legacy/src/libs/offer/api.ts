import { Offer as OfferAPI } from '../../api/types';
import {
  getAuth,
  postAuth,
  putAuth,
  deleteAuth,
  patchAuth,
  buildUrlParams,
  get,
} from '../../http';
import type {
  OfferCreate,
  OfferEdit,
  OfferFilterData,
  UserRegistrationParams,
  OfferStatusWaitingListPosition,
  OfferStatusParams,
  OfferStatus,
  OfferREST,
  DeleteOfferPayload,
  RecurrenceResponse,
} from './types';

import { PaginatedResponse } from '../../state/types';
import type { PaginationFilterParams } from '../types';
import Config from '#src/config';
import { UserRegistrationResponse } from '#src/libs/booker-module/types';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;
const API_URI = Config.REACT_APP_BASE_URI_BOOK_V0;
const API_URI_BUYABLE = Config.REACT_APP_BASE_URI_BUYABLE_V0;

export async function createOffers(data: OfferCreate) {
  return postAuth(`${API_V1_URI}/offer/create_similar_offers/`, data);
}

export async function getLastOfferInRecurrence(offerId: number) {
  return getAuth<RecurrenceResponse>(
    `${API_V1_URI}/offer/${offerId}/recurrence/`,
  );
}

export async function editOffers({
  offerId,
  data,
}: {
  offerId: number;
  data: OfferEdit;
}) {
  return putAuth(`${API_V1_URI}/offer/${offerId}/`, data);
}

export async function postRollCallOffer(offerId: number) {
  return postAuth(`${API_V1_URI}/offer/${offerId}/rollcall/`);
}

export async function postRollCallBulk(data: { offer_id_list: Array<number> }) {
  return postAuth(`${API_V1_URI}/offer/rollcall_bulk/`, data);
}

export async function fetchAllEvents(params: any) {
  return getAuth(`${API_V1_URI}/offer/minimal/${buildUrlParams(params)}`);
}

export async function fetchOffersByDay(params: any) {
  return getAuth(`${API_V1_URI}/offer/as_manager/${buildUrlParams(params)}`);
}

export async function fetchOffersList(
  params: {
    company?: number;
    min_date?: string;
    max_date?: string;
    username?: string;
    available?: boolean;
    is_workshop?: boolean;
    only_future?: boolean;
    with_booking_window?: boolean;
  } & OfferFilterData,
) {
  return getAuth(`${API_V1_URI}/offer/${buildUrlParams(params)}`);
}

export function fetchSimilarOffersUntyped(offerId: number, params: any) {
  return getAuth(
    `${API_V1_URI}/offer/${offerId}/similars/${buildUrlParams(params || null)}`,
  );
}

export function fetchSimilarOffers(
  offerId: number,
  params: PaginationFilterParams,
) {
  return getAuth<PaginatedResponse<OfferREST>>(
    `${API_V1_URI}/offer/${offerId}/similars/${buildUrlParams(params)}`,
  );
}

export async function fetchOfferStatus(
  offerId: number,
  params: OfferStatusParams = {},
) {
  return getAuth<OfferStatus>(
    `${API_V1_URI}/offer/${offerId}/bookable_status/${buildUrlParams(params)}`,
  );
}

export async function fetchOfferStatusPublic(
  offerId: number,
  params: OfferStatusParams = {},
) {
  return get<OfferStatus>(
    `${API_V1_URI}/offer/${offerId}/public_bookable_status/${buildUrlParams(
      params,
    )}`,
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

export async function fetchOfferWaitingListPosition(
  offerId: number,
  params: { [key: string]: number | string | boolean } = {},
) {
  return getAuth<OfferStatusWaitingListPosition>(
    `${API_V1_URI}/offer/${offerId}/waiting_list_position/${buildUrlParams(
      params,
    )}`,
  );
}

export async function fetchOfferWaitingListPositionList(
  id__in: number[],
  params: { [key: string]: number | string | boolean } = {},
) {
  return getAuth<PaginatedResponse<OfferStatusWaitingListPosition>>(
    `${API_V1_URI}/offer/waiting_list_position_list/${buildUrlParams({
      id__in,
      ...params,
    })}`,
  );
}

export async function postUserRegistration(
  data: {
    one_click_checkout?: boolean;
    consumer_payment_pack?: number;
    payment_pack?: number;
    payment_combo?: number;
    email?: string;
    offers: Array<{ offer_id: number; extra_data: any }>;
  },
  params?: UserRegistrationParams,
) {
  return postAuth<UserRegistrationResponse>(
    ` ${API_V1_URI}/offer/user_registration/${buildUrlParams(params)}`,
    data,
  );
}

export async function fetchCompatiblePacks(offerId: number) {
  return getAuth(`${API_URI_BUYABLE}/saas/offer/${offerId}/compatible-packs/`);
}

export async function fetchById(offerId: number) {
  return getAuth(`${API_URI}/saas/offer/${offerId}/`);
}

export async function disableOffer({
  offerId,
  notify,
  deleteAll,
  custom_selection,
  custom_selection_ids,
  cancel_linked_hybrid_offer,
}: {
  offerId: number;
  notify: boolean;
  deleteAll: boolean;
  custom_selection: boolean;
  custom_selection_ids: number[];
  cancel_linked_hybrid_offer?: boolean;
}) {
  return patchAuth(`${API_V1_URI}/offer/manager/${offerId}/cancel/`, {
    should_notify: notify,
    apply_to_all_similar_offers: deleteAll,
    selected_similar_offer_ids: custom_selection ? custom_selection_ids : [],
    cancel_linked_hybrid_offer,
  });
}

export async function deleteOffer(offerId: number, data: DeleteOfferPayload) {
  return deleteAuth(`${API_V1_URI}/offer/manager/${offerId}/delete/`, {
    apply_to_all_similar_offers: data.deleteAll,
    selected_similar_offer_ids: data.custom_selection
      ? data.custom_selection_ids
      : [],
  });
}

export const isRegistered = async (offerId: number) => {
  return getAuth(`${API_V1_URI}/offer/${offerId}/is_registered/`);
};

export const userRegistration = async () => {
  return getAuth(`${API_V1_URI}/offer/registered/`);
};

export async function retrieveOffer(
  offerId: number,
  params?: { with_booking_window?: boolean },
) {
  return getAuth<OfferREST>(
    `${API_V1_URI}/offer/${offerId}/${buildUrlParams({
      ...(params || {}),
      with_full: true,
      with_tags_status: true,
    })}`,
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
  is_workshop?: boolean;
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

export async function fetchBookingGuestNumber(offer_id: number) {
  return getAuth(`${API_V1_URI}/offer/${offer_id}/booking_for_guest/`);
}

export async function fetchBookingGuestNumberEligibleLeftByOfferBulk(
  id__in: number[],
) {
  return getAuth<Record<number, number>>(
    `${API_V1_URI}/offer/booking_for_guest_bulk/${buildUrlParams({ id__in })}`,
  );
}

export const listOffersWithPendingReplacementRequestIds = (data: {
  offer_id_list: number[];
}) => {
  return postAuth(
    `${API_V1_URI}/offer/with_pending_replacement_request/`,
    data,
  );
};

export const listOffersWithRefusedReplacementRequestIds = (data: {
  offer_id_list: number[];
}) => {
  return postAuth(
    `${API_V1_URI}/offer/with_refused_replacement_request/`,
    data,
  );
};

export const invalidatePendingBooking = (offerId: number) =>
  patchAuth<void>(
    `${API_V1_URI}/offer/${offerId}/invalidate_pending_booking_for_billing_plan/`,
    {},
  );

export const updateInternalNote = (
  offerId: number,
  data: { internal_note: string },
) => {
  return patchAuth<OfferAPI>(
    `${API_V1_URI}/offer/${offerId}/update_internal_note/`,
    data,
  );
};

export default {
  fetchAllEvents,
  fetchCompatiblePacks,
  disableOffer,
  delete: deleteOffer,
  fetchOffersByDay,
  fetchSimilarOffersUntyped,
  fetchSimilarOffers,
  fetchById,
  toggleWaitingListFreeze,
  fetchOffersList,
  fetchBookedGender,
  fetchOfferStatus,
  checkOfferTagEligibility,
  getLastOfferInRecurrence,
};
