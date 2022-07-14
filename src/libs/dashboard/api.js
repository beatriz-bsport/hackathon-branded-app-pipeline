// @flow
import { API_V1_URI, getAuth, patchAuth } from '../../http';
import type { DataSourceDashboardSettings } from './types';

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

export async function fetchManagerRessourceFilters() {
  return getAuth(`${API_V1_URI}/dashboard/filters_ressources/me/`);
}

export async function updateManagerRessousrcesFilters(data: any) {
  return patchAuth(`${API_V1_URI}/dashboard/filters_ressources/me/`, data);
}

// -------------------------------------------------------
export async function fetchDataSourceDashboardGraphMetadata() {
  return getAuth(`${API_V1_URI}/dashboard/graph_metadata`);
}

export async function fetchDataSourceDashboardSettings() {
  return getAuth(`${API_V1_URI}/dashboard/data_source_dashboard_settings/me/`);
}

export async function updateDataSourceDashboardSettings(data: {
  settings: DataSourceDashboardSettings,
}) {
  return patchAuth(
    `${API_V1_URI}/dashboard/data_source_dashboard_settings/me/`,
    data,
  );
}
