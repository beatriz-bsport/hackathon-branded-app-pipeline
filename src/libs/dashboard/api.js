// @flow
import { API_V1_URI, getAuth, patchAuth } from '../../http.ts';

export async function fetchDashboardSettings() {
  return getAuth(`${API_V1_URI}/dashboard/settings/me/`);
}

export async function updateDashboardSettings(data: any) {
  return patchAuth(`${API_V1_URI}/dashboard/settings/me/`, data);
}
