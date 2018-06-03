import axios from 'axios';
import moment from 'moment';

import { getAuth } from './http';

const BASE_URI = process.env.REACT_APP_BASE_URI;
const API_URI = `${BASE_URI}/api-v0`;

export async function resetPassword(email) {
  return axios.get(`${BASE_URI}/authentication/password_reset_email/${email}`);
}

export async function fetchAllEvents() {
  return getAuth(`${API_URI}/as_coach/offers/minimal`);
}

export async function login(username, password) {
  return axios({
    url: `${BASE_URI}/authentication/with-login/`,
    method: 'post',
    data: {
      username,
      password,
    },
  });
}

export async function fetchAllActivities() {
  return getAuth(`${API_URI}/as_coach/activities/`);
}

export async function fetchBookingsByOffer(offerId) {
  return getAuth(`${API_URI}/as_coach/offer/${offerId}/bookings`);
}

export default {
  booking: {
    fetchBookingsByOffer,
  },
  offer: {
    fetchAllEvents: fetchAllEvents,
  },
  auth: {
    resetPassword,
    login,
  },
  activity: {
    fetchAllActivities,
  },
};
