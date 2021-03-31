// @flow
import { API_V1_URI, getAuth, patchAuth } from '../../http';

export async function fetchDashboardSettings() {
  return getAuth(`${API_V1_URI}/dashboard/settings/me/`);
}

export async function updateDashboardSettings(data: any) {
  return patchAuth(`${API_V1_URI}/dashboard/settings/me/`, data);
}

export async function fetchManagerFiltersSettings() {
  return getAuth(`${API_V1_URI}/dashboard/filters_settings/me/`);
}

export async function updateManagerFiltersSettings(data: any) {
  return patchAuth(`${API_V1_URI}/dashboard/filters_settings/me/`, data);
}
