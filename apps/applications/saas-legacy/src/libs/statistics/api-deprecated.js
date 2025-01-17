import { API_URI, postAuth, getJSONAuth, buildUrlParams } from '../../http';

export async function fetchBookingStatistics(params) {
  return getJSONAuth(`${API_URI}/statistics/booking/${buildUrlParams(params)}`);
}

export async function fetchOffersWaitingListStatistics(params) {
  return getJSONAuth(
    `${API_URI}/statistics/offer-waiting-list/${buildUrlParams(params)}`,
  );
}

export default {
  fetchBookingStatistics,
  fetchOffersWaitingListStatistics,
};
