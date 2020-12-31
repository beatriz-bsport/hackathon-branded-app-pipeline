// @flow
import { API_V1_URI, getAuth } from '../../http';

export async function fetchBackgroundTask(uuid: string) {
  return getAuth(`${API_V1_URI}/background_task/${uuid}/`);
}
