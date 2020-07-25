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

export const fetchBookingBroadcastRoom = async (id: number) => {
  return getAuth(`${API_V1_URI}/booking/${id}/broadcast_room/`);
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
  data: {
    offer: number | Array<number>,
    keep_credits: boolean,
    notify_member: boolean,
  },
) => {
  return postAuth(
    `${API_V1_URI}/payment-pack/consumer-payment-pack/${consumer_payment_pack}/register_booking/`,
    data,
  );
};
