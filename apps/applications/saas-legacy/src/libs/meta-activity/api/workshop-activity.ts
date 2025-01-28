import { buildUrlParams, getAuth } from '../../../http';
import Config from '../../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BOOK_V1;

export async function fetchMetaActivities(params?: {
  company: number;
  with_future_slots: boolean;
}) {
  return getAuth(
    `${API_V1_URI}/meta-activity/${buildUrlParams({
      ...(params ?? {}),
      is_workshop: true,
      page_size: null,
    })}`,
  );
}

export default {
  fetchMetaActivities,
};
