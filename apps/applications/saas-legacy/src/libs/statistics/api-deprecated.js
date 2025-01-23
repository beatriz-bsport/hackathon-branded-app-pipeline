import { getJSONAuth, buildUrlParams, API_V1_URI } from '../../http';

export async function fetchBookingStatistics(params) {
  return getJSONAuth(
    `${API_V1_URI}/booking/booking_statistics/${buildUrlParams(params)}`,
  );
}

export async function fetchOffersWaitingListStatistics(params) {
  return getJSONAuth(
    `${API_V1_URI}/waiting-list/booking_option_statistics/${buildUrlParams(
      params,
    )}`,
  );
}

export default {
  fetchBookingStatistics,
  fetchOffersWaitingListStatistics,
};
