import { getJSONAuth, buildUrlParams } from '../../http';
import Config from '../../config';

const API_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export async function fetchBookingStatistics(params) {
  return getJSONAuth(
    `${API_URI}/booking/booking_statistics/${buildUrlParams(params)}`,
  );
}

export async function fetchOffersWaitingListStatistics(params) {
  return getJSONAuth(
    `${API_URI}/waiting-list/booking_option_statistics/${buildUrlParams(
      params,
    )}`,
  );
}

export default {
  fetchBookingStatistics,
  fetchOffersWaitingListStatistics,
};
