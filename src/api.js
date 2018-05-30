import axios from 'axios';
import moment from 'moment';

import { getAuth } from './http';

const BASE_URI = process.env.REACT_APP_BASE_URI;
const API_URI = `${BASE_URI}/api-v0`;

export async function resetPassword(email) {
  return axios.get(`${BASE_URI}/authentication/password_reset_email/${email}`);
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
