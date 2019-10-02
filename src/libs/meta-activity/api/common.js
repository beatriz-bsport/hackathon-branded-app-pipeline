// @flow
import {
  API_V1_URI,
  deleteAuth,
  postAuth,
  getAuth,
  patchAuth,
  buildUrlParams,
} from '../../../http';

export async function fetchAllActivities(params: any) {
  return getAuth(`${API_V1_URI}/meta-activity/${buildUrlParams(params)}`);
}

export async function fetchMetaActivityDetails(id: number) {
  return getAuth(`${API_V1_URI}/meta-activity/${id}/`);
}

export async function addMetaActivity(data: *) {
  return postAuth(`${API_V1_URI}/meta-activity/`, data);
}

export async function deleteMetaActivity(id: number) {
  return deleteAuth(`${API_V1_URI}/meta-activity/${id}/`);
}

export async function checkCanDeleteMetaActivity(id: number) {
  return getAuth(`${API_V1_URI}/meta-activity/${id}/can_destroy/`);
}

export async function updateMetaActivity(data: *, id: number) {
  const aId = data.get('id') || id;
  return patchAuth(`${API_V1_URI}/meta-activity/${aId}/`, data);
}

export default {
  fetchAllActivities,
  fetchMetaActivityDetails,
  addMetaActivity,
  updateMetaActivity,
  deleteMetaActivity,
};
