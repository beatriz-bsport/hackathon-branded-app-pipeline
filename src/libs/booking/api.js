import { buildUrlParams, API_V1_URI, getAuth } from '../../http';

export const fetchFilteredBookingOptions = async (params) => {
  return getAuth(
    `${API_V1_URI}/waiting-list/booking-option/${buildUrlParams(params)}`,
  );
};
