import axios from 'axios';
import moment from 'moment';

import { getAuth } from './http';

const API_URI = 'http://localhost:8000/api-v0';
const BASE_URI = process.env.REACT_APP_BASE_URI;

export async function resetPassword(email) {
  return axios.get(`${BASE_URI}/authentication/password_reset_email/${email}`);
}

export function fetchAllOffersFake() {
  const offers = [
    {
      start: new Date(moment()),
      end: new Date(moment().add(1, 'hours')),
      title: 'lol',
    },
  ];

  return offers;
}

export async function fetchAllOffers() {
  return getAuth(`${API_URI}/as_coach/offers/`);
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

export default {
  offer: {
    fetchAll: fetchAllOffers,
  },
  auth: {
    resetPassword,
    login,
  },
};
