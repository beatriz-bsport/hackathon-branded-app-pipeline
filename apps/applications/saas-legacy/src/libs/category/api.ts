import { getAuth, buildUrlParams } from '../../http';
import Config from '../../config';

const API_URI = Config.REACT_APP_BASE_URI_CORE_V0;

export async function fetchSCT(params: any = {}) {
  return getAuth(`${API_URI}/category/SCT${buildUrlParams(params || {})}`);
}

export default {
  fetchSCT,
};
