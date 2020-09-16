import { API_URI, postAuth, getJSONAuth, buildUrlParams } from '../http';

export async function bookings() {
  return getJSONAuth(`${API_URI}/statistics/bookings`);
}
export async function newMembers() {
  return getJSONAuth(`${API_URI}/statistics/new-members`);
}
export async function turnover() {
  return getJSONAuth(`${API_URI}/statistics/turnover`);
}

export async function bookingStatistics(params) {
  return getJSONAuth(
    `${API_URI}/statistics/booking-statistics${buildUrlParams(params)}`,
  );
}

export async function fetchSmartListStatsAPI(params) {
  return postAuth(
    `${API_URI}/statistics/smart_list_stats/get_statistics/`,
    params,
  );
}

export async function fetchBookingStatistics(params) {
  return getJSONAuth(`${API_URI}/statistics/booking/${buildUrlParams(params)}`);
}

export default {
  bookings,
  newMembers,
  turnover,
  fetchSmartListStatsAPI,
  bookingStatistics,
  fetchBookingStatistics,
};
