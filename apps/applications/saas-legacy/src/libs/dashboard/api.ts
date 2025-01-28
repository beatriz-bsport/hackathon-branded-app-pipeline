import { getAuth, patchAuth } from '#src/http';
import type {
  DataSourceDashboardSettings,
  MyResourceFilters,
  MyRessourceScheduleFilters,
} from '#src/libs/dashboard/types';
import Config from '../../config';

const API_V1_URI = Config.REACT_APP_BASE_URI_BUSINESS_INSIGHTS_V1;

export function fetchDashboardSettings() {
  return getAuth(`${API_V1_URI}/dashboard/settings/me/`);
}

export function fetchManagerFiltersSettings() {
  return getAuth(`${API_V1_URI}/dashboard/filters_settings/me/`);
}

export function updateManagerFiltersSettings(data: any) {
  return patchAuth(`${API_V1_URI}/dashboard/filters_settings/me/`, data);
}

/**
 * Fetches the current schedule resource filters settings for the manager.
 *
 * @returns A promise that resolves with the manager's schedule resource filters.
 */
export function fetchManagerScheduleResourceFilters() {
  return getAuth<MyResourceFilters>(
    `${API_V1_URI}/dashboard/filters_ressources/me/`,
  );
}

/**
 * Updates the schedule resource filters settings for the manager.
 *
 * @param data - A partial object containing the updated schedule resource filters.
 * @returns A promise that resolves with the updated manager's schedule resource filters.
 */
export function updateManagerScheduleResourcesFilters(data: {
  filters: [MyRessourceScheduleFilters];
}) {
  return patchAuth<MyResourceFilters>(
    `${API_V1_URI}/dashboard/filters_ressources/me/`,
    data,
  );
}
// -------------------------------------------------------
export function fetchDataSourceDashboardGraphMetadata() {
  return getAuth(`${API_V1_URI}/dashboard/graph_metadata`);
}

export function fetchDataSourceDashboardSettings() {
  return getAuth(`${API_V1_URI}/dashboard/data_source_dashboard_settings/me/`);
}

export function updateDataSourceDashboardSettings(data: {
  settings: DataSourceDashboardSettings;
}) {
  return patchAuth(
    `${API_V1_URI}/dashboard/data_source_dashboard_settings/me/`,
    data,
  );
}
