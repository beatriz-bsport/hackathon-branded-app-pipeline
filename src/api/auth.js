import axios from 'axios';
import { API_URI, BASE_URI, post, putAuth, getAuth } from '../http';

export async function accessLevel(token) {
  return getAuth(`${API_URI}/saas/access_level`, token);
}

export async function signup(data) {
  return post(`${API_URI}/auth/signup`, data);
}

export async function resetPassword(email) {
  return axios.get(`${BASE_URI}/authentication/password_reset_email/${email}`);
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

export async function updateProfile(data) {
  return putAuth(`${API_URI}/profile/update`, data);
}

export async function requestSMSCode(phonenumber) {
  return axios({
    url: `${BASE_URI}/authentication/with-phone/`,
    method: 'post',
    data: {
      phonenumber,
    },
  });
}

export async function validatePhone(phonenumber, code) {
  return axios({
    url: `${BASE_URI}/authentication/validate-phone/`,
    method: 'post',
    data: {
      code,
      phonenumber,
    },
  });
}

export async function requestSMSCodeNoRegistration(phonenumber) {
  return axios({
    url: `${BASE_URI}/authentication/with-phone/no-user-creation`,
    method: 'post',
    data: {
      phonenumber,
    },
  });
}

export default {
  updateProfile,
  resetPassword,
  login,
  accessLevel,
  requestSMSCode,
  requestSMSCodeNoRegistration,
  validatePhone,
  signup,
};
