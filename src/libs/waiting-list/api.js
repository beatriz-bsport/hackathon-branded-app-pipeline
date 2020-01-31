// @flow
import {
  API_V1_URI,
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
} from '../../http';

export const fetchConfiguration = async () => {
  return getAuth(`${API_V1_URI}/waiting-list/configuration/me/`);
};

export const patchConfiguration = async (data: *) => {
  return patchAuth(`${API_V1_URI}/waiting-list/configuration/me/`, data);
};

export const fetchFilteredBookingOptions = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};

export async function discardBookingOption(optionId: number) {
  return postAuth(
    `${API_V1_URI}/waiting-list/booking-option/${optionId}/discard/`,
  );
}

export async function registerOptionToWaitingList(
  offer: number,
  member: ?number,
) {
  return postAuth(`${API_V1_URI}/waiting-list/booking-option/register/`, {
    offer,
    member,
  });
}
