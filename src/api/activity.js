import { API_URI, getAuth, patchAuth, postAuth } from '../http';

export async function fetchAllActivities() {
  return getAuth(`${API_URI}/saas/meta-activities/`);
}

export async function fetchActivitiesMinimal() {
  return getAuth(`${API_URI}/saas/activities/minimal/`);
}

export async function fetchMetaActivityDetails(id) {
  return getAuth(`${API_URI}/saas/meta-activities/${id}/`);
}

export async function addMetaActivity(data) {
  return postAuth(`${API_URI}/saas/create-meta-activity/`, data);
}

export async function updateMetaActivity(data, id) {
  const aId = data.get('id') || id;
  return patchAuth(`${API_URI}/saas/update-meta-activity/${aId}`, data);
}

export default {
  fetchAllActivities,
  fetchMetaActivityDetails,
  fetchMinimal: fetchActivitiesMinimal,
  addMetaActivity,
  updateMetaActivity,
};
