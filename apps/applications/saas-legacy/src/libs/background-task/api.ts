import { getAuth } from '../../http';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_PLATFORM_V1;

export async function fetchBackgroundTask(uuid: string) {
  return getAuth(`${API_V1_URI}/background_task/${uuid}/`);
}
