// @flow
import { API_V1_URI, getAuth } from '../../http.ts';

export async function fetchBackgroundTask(uuid: string) {
  return getAuth(`${API_V1_URI}/background_task/${uuid}/`);
}
