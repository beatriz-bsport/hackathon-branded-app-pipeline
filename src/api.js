import axios from 'axios';

import { getAuth, postAuth, putAuth } from './http';

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

export async function addMetaActivity(data) {
  return postAuth(`${API_URI}/saas/create-meta-activity/`, data);
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

export async function addMember(data) {
  return postAuth(`${API_URI}/saas/create-member/`, data);
}

export async function fetchAllPaymentPacks() {
  return getAuth(`${API_URI}/saas/payment-pack/`);
}

export async function fetchTransactions() {
  return getAuth(`${API_URI}/saas/transactions`);
}

export async function fetchDashboardStats() {
  return getAuth(`${API_URI}/saas/stats/dashboard`);
}

export async function fetchAllActivitiesStats() {
  return getAuth(`${API_URI}/saas/stats/meta-activity`);
}

export async function fetchActivityStats(metaActivityId) {
  return getAuth(`${API_URI}/saas/stats/meta-activity/${metaActivityId}`);
}

export async function payWithStripe(token, purchaseId, purchaseType) {
  return postAuth(`${API_URI}/pay/stripe/${purchaseType}/${purchaseId}`, {
    token,
  });
}

export async function consumerRequestOffer(offerId) {
  return getAuth(`${API_URI}/offer/${offerId}/`);
}

export async function consumerRequestPaymentPack(paymentPackId) {
  return getAuth(`${API_URI}/saas/payment-pack/${paymentPackId}`);
}

export async function addCreditToConsumerPack(paymentPackId, nbCredit) {
  return getAuth(
    `${API_URI}/saas/payment-pack/${paymentPackId}/add-credit/${nbCredit}`,
  );
}

export async function subCreditToConsumerPack(paymentPackId, nbCredit) {
  return getAuth(
    `${API_URI}/saas/payment-pack/${paymentPackId}/sub-credit/${nbCredit}`,
  );
}

export async function fetchConsumerOptions() {
  return getAuth(`${API_URI}/booking/options/`);
}

export async function fetchConsumerPastBookings() {
  return getAuth(`${API_URI}/booking/past/`);
}

export async function fetchConsumerFutureBookings() {
  return getAuth(`${API_URI}/booking/future/`);
}

export async function fetchConsumerPaymentPacks() {
  return getAuth(`${API_URI}/consumer/payment-pack/`);
}

export async function consumerCancelBookingOption(optionId) {
  return getAuth(`${API_URI}/booking/options/${optionId}/cancel/`);
}
export async function consumerFetchProfile() {
  return getAuth(`${API_URI}/user/self/info/`);
}

export async function consumerFetchCompatiblePass(offerId) {
  return getAuth(`${API_URI}/pay/offer/${offerId}/compatible-packs`);
}

export async function consumerPayWithConsumerPaymentPack(
  consumerPaymentPackId,
  offerId,
) {
  return postAuth(`${API_URI}/pay/pass/offer/${offerId}`, {
    token: consumerPaymentPackId,
  });
}

export default {
  category: {
    fetchSCT,
  },
  transaction: {
    fetchAll: fetchTransactions,
  },
  booking: {
    fetchBookingsByOffer,
  },
  offer: {
    fetchAllEvents,
  },
  auth: {
    updateProfile,
    resetPassword,
    login,
    accessLevel,
    requestSMSCode,
    validatePhone,
  },
  establishment: {
    fetchAll: fetchAllEstablishments,
  },
  stats: {
    fetchDashboard: fetchDashboardStats,
    fetchActivities: fetchAllActivitiesStats,
    fetchActivity: fetchActivityStats,
  },
  activity: {
    fetchAllActivities,
    fetchMetaActivityDetails,
    fetchMinimal: fetchActivitiesMinimal,
    addMetaActivity,
  },
  coach: {
    fetchAssociated: fetchAssociatedCoaches,
    addCoach,
  },
  member: {
    fetchAll: fetchAllMembers,
    fetchBookings: fetchMemberBookings,
    fetchMember,
    addMember,
  },
  paymentPack: {
    fetchAll: fetchAllPaymentPacks,
    addCredit: addCreditToConsumerPack,
    subCredit: subCreditToConsumerPack,
  },
  payment: {
    payWithStripe,
    payWithConsumerPaymentPack: consumerPayWithConsumerPaymentPack,
    fetchOffer: consumerRequestOffer,
    fetchPaymentPack: consumerRequestPaymentPack,
    fetchCompatiblePass: consumerFetchCompatiblePass,
  },
  consumer: {
    fetchFutureBookings: fetchConsumerFutureBookings,
    fetchPastBookings: fetchConsumerPastBookings,
    fetchOptions: fetchConsumerOptions,
    fetchConsumerPaymentPacks,
    cancelBookingOption: consumerCancelBookingOption,
    fetchProfile: consumerFetchProfile,
  },
};
