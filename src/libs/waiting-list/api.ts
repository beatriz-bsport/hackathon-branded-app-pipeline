import { AxiosResponse } from 'axios';
import { OfferStatusWaitingListPosition } from '#src/libs/offer/types';
import { PaginatedResponse } from '../../state/types';
import {
  API_V1_URI,
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';
import type {
  WaitingListConfiguration,
  WaitingListBookingOption,
  WaitingListBookingOptionQueryParams,
  WaitingListBookingOptionPaginatedQueryParams,
  DiscardBookingOptionParams,
} from './types';

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
) => {
  return getAuth<PaginatedResponse<WaitingListBookingOption>>(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};

export const discardBookingOption = (
  bookingOptionId: number,
  params: Omit<DiscardBookingOptionParams, 'bookingOptionId'>,
): Promise<AxiosResponse<WaitingListBookingOption>> => {
  return postAuth<WaitingListBookingOption>(
    `${API_V1_URI}/waiting-list/booking-option/${bookingOptionId}/discard/`,
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
