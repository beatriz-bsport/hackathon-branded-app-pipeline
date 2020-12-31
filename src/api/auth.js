// @flow
import axios from 'axios';
import {
  API_URI,
  API_V1_URI,
  BASE_URI,
  post,
  putAuth,
  getAuth,
} from '../http';

export async function accessLevel(token: string) {
  return getAuth(`${API_URI}/saas/access_level`, token);
}

export async function signup(data: *) {
  return post(`${API_URI}/auth/signup`, data);
}

export async function resetPassword(email: string) {
  return axios.get(`${BASE_URI}/authentication/password_reset_email/${email}`);
}

export async function login(email: string, password: string) {
  return post(`${API_V1_URI}/authentication/signin/with-login/`, {
    email,
    password,
  });
}

export async function checkEmailExists(email: string) {
  return post(`${API_V1_URI}/authentication/signup/exists/`, {
    email,
  });
}

export async function updateProfile(data: *) {
  return putAuth(`${API_URI}/profile/update`, data);
}

export async function changePassword({
  uid,
  token,
  password,
}: {
  uid: string,
  token: string,
  password: string,
}) {
  return post(`${API_URI}/auth/password/reset/confirm/`, {
    uid,
    token,
    new_password1: password,
    new_password2: password,
  });
}

export default {
  updateProfile,
  resetPassword,
  login,
  accessLevel,
  signup,
  changePassword,
  checkEmailExists,
};
