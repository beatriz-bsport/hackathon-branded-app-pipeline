import { API_URI, getAuth, buildUrlParams } from '../../http';

export async function fetchSCT(params: any = {}) {
  return getAuth(`${API_URI}/category/SCT${buildUrlParams(params || {})}`);
}

export default {
  fetchSCT,
};
