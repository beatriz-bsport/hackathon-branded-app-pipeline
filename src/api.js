import axios from 'axios';
import moment from 'moment';

import { getAuth, postAuth } from './http';

const BASE_URI = process.env.REACT_APP_BASE_URI;
const API_URI = `${BASE_URI}/api-v0`;

export async function addCoach(data) {
  return postAuth(`${API_URI}/saas/create-coach/`, data);
}

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

export async function fetchAllEstablishments() {
  return getAuth(`${API_URI}/saas/establishments/`);
}

export async function fetchAllActivities() {
  return getAuth(`${API_URI}/saas/meta-activities/`);
}

export async function fetchActivitiesMinimal() {
  return getAuth(`${API_URI}/saas/activities/minimal/`);
}

export async function fetchMetaActivityDetails(id) {
  return getAuth(`${API_URI}/saas/meta-activities/${id}/`);
}

export async function getStats(metaActivityId) {
  return getAuth(`${API_URI}/saas/meta-activity/${metaActivityId}/stats`);
}

export async function getAllStats() {
  return getAuth(`${API_URI}/saas/meta-activity/stats`);
}

export async function fetchBookingsByOffer(offerId) {
  return getAuth(`${API_URI}/as_coach/offer/${offerId}/bookings`);
}

export async function fetchSCT() {
  return getAuth(`${API_URI}/category/SCT`);
}

export async function accessLevel(token) {
  return getAuth(`${API_URI}/saas/access_level`, (token = token));
}

export async function fetchAssociatedCoaches() {
  return getAuth(`${API_URI}/coach/associated/`);
}

export async function fetchAllMembers() {
  return getAuth(`${API_URI}/saas/members`);
}

export async function fetchMemberBookings(memberId) {
  return getAuth(`${API_URI}/saas/members/${memberId}/bookings`);
}

export async function fetchMember(memberId) {
  return getAuth(`${API_URI}/saas/members/${memberId}`);
}
export async function fetchAllPaymentPacks() {
  return getAuth(`${API_URI}/saas/payment-pack/`);
}

export default {
  category: {
    fetchSCT,
  },
  booking: {
    fetchBookingsByOffer,
  },
  offer: {
    fetchAllEvents: fetchAllEvents,
  },
  auth: {
    resetPassword,
    login,
    accessLevel,
  },
  establishment: {
    fetchAll: fetchAllEstablishments,
  },
  activity: {
    fetchAllActivities,
    getStats,
    getAllStats,
    fetchMetaActivityDetails,
    fetchMinimal: fetchActivitiesMinimal,
  },
  coach: {
    fetchAssociated: fetchAssociatedCoaches,
    addCoach,
  },
  member: {
    fetchAll: fetchAllMembers,
    fetchBookings: fetchMemberBookings,
    fetchMember: fetchMember,
  },
  paymentPack: {
    fetchAll: fetchAllPaymentPacks,
  },
};
