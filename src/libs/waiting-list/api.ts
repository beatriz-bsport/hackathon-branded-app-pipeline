import { AxiosResponse } from 'axios';
import { PaginatedResponse } from '../../state/types';
import {
  API_V1_URI,
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';
import {
  WaitingListConfiguration,
  WaitingListBookingOption,
  WaitingListBookingOptionQueryParams,
  WaitingListBookingOptionPaginatedQueryParams,
} from './types';
import { OfferStatusWaitingListPosition } from '#libs/offer/types';

export const fetchConfiguration = async (): Promise<
  AxiosResponse<WaitingListConfiguration>
> => {
  return getAuth(`${API_V1_URI}/waiting-list/configuration/me/`);
};

export const fetchCompanyConfiguration = async (params?: {
  company?: number;
}): Promise<AxiosResponse<WaitingListConfiguration>> => {
  return getAuth(`${API_V1_URI}/waiting-list/configuration/${params.company}/`);
};

export const patchConfiguration = async (
  data: WaitingListConfiguration,
): Promise<AxiosResponse<WaitingListConfiguration>> => {
  return patchAuth(`${API_V1_URI}/waiting-list/configuration/me/`, data);
};

export const fetchFilteredBookingOptions = async (
  params: WaitingListBookingOptionQueryParams,
): Promise<AxiosResponse<WaitingListBookingOption[]>> => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};

export const fetchFilteredBookingOptionsPaginated = async (
  params: WaitingListBookingOptionPaginatedQueryParams,
): Promise<AxiosResponse<PaginatedResponse<WaitingListBookingOption>>> => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};

export const discardBookingOption = async (
  optionId: number,
  params: { disable_notification?: boolean; update_waiting_list?: boolean },
): Promise<AxiosResponse<WaitingListBookingOption>> => {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/${optionId}/discard/`,
    params,
  );
};

export const registerOptionToWaitingList = async (
  offer: number,
  member?: number,
): Promise<AxiosResponse<WaitingListBookingOption>> => {
  return postAuth(`${API_V1_URI}/waiting-list/booking-option/register/`, {
    offer,
    member,
  });
};

export const registerMultipleOptionsBackground = async (
  booking_options_ids: number[],
) => {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/register_multiple_background/`,
    {
      booking_options_ids,
    },
  );
};

export async function fetchAllWaitingListPositions(offerId: number) {
  return getAuth<OfferStatusWaitingListPosition[]>(
    `${API_V1_URI}/offer/${offerId}/waiting_list_all_positions/`,
  );
}
