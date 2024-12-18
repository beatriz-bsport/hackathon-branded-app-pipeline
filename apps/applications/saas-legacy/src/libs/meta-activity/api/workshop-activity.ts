import { API_V1_URI, buildUrlParams, getAuth } from '../../../http';

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
