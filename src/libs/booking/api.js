// @flow
import {
  buildUrlParams,
  API_V1_URI,
  API_URI,
  getAuth,
  postAuth,
} from '../../http';

export const fetchFilteredBookingOptions = async (params: any) => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};

export const fetchBookingList = async (params: any) => {
  return getAuth(`${API_V1_URI}/booking/${buildUrlParams(params)}`);
};

export const retrieveBooking = async (id: number) => {
  return getAuth(`${API_V1_URI}/booking/${id}/`);
};

export const discardAttendance = async (id: number) => {
  return postAuth(`${API_V1_URI}/booking/${id}/attendance/`, {
    attendance: false,
  });
};

export const confirmAttendance = async (id: number) => {
  return postAuth(`${API_V1_URI}/booking/${id}/attendance/`, {
    attendance: true,
  });
};

export const cancelBooking = async (id: number, data: any = {}) => {
  return postAuth(`${API_V1_URI}/booking/${id}/cancel/`, data);
};

export const registerBooking = async (
  consumer_payment_pack: number,
  offerId: number,
) => {
  return postAuth(`${API_URI}/payment/register/booking/${offerId}`, {
    consumer_payment_pack,
  });
};
