// @flow

import { createAction } from 'redux-actions';
import defaultDashboardConfiguration from './dashboardGraphs';
import defaultDataSourceDashboardConfiguration from './defaultDataSourceDashboardSettings';
import {
  fetchDashboardSettings as fetchDashboardSettingsAPI,
  updateDashboardSettings as updateDashboardSettingsAPI,
  fetchManagerFiltersSettings as fetchManagerFiltersSettingsAPI,
  updateManagerFiltersSettings as updateManagerFiltersSettingsAPI,
  fetchManagerRessourceFilters as fetchManagerRessourceFiltersAPI,
  updateManagerRessousrcesFilters as updateManagerRessousrcesFiltersAPI,
  // -------------------------------------------------------------------
  fetchDataSourceDashboardGraphMetadata as fetchDataSourceDashboardGraphMetadataAPI,
  fetchDataSourceDashboardSettings as fetchDataSourceDashboardSettingsAPI,
  updateDataSourceDashboardSettings as updateDataSourceDashboardSettingsAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '../snackbar/actions';
import type { Dispatch, OptionCallback } from '../../state/types';
import type { DataSourceDashboardSettings } from './types';

export const dashboardSettings = {
  isLoading: createAction('DASHBOARD/SETTINGS/IS_LOADING'),
  error: createAction('DASHBOARD/SETTINGS/ERROR'),
  success: createAction('DASHBOARD/SETTINGS/SUCCESS'),
};

export function fetchDashboardSettings(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(dashboardSettings.isLoading(true));
    dispatch(dashboardSettings.error(null));

    try {
      const response = await fetchDashboardSettingsAPI();
      const { settings } = response.data;
      if (!settings.length) {
        dispatch(
          dashboardSettings.success({
            ...response.data,
            settings: defaultDashboardConfiguration,
          }),
        );
      } else {
        dispatch(dashboardSettings.success(response.data));
      }
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(dashboardSettings.error(error));
    }

    dispatch(dashboardSettings.isLoading(false));
  };
}

export function updateDashboardSettings(
  settings: Array<DashboardTab>,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(dashboardSettings.isLoading(true));
    dispatch(dashboardSettings.error(null));

    try {
      const response = await updateDashboardSettingsAPI({ settings });
      dispatch(dashboardSettings.success(response.data));
      dispatch(snackbarSuccess('dashboard.save.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(dashboardSettings.error(error));
      dispatch(snackbarError('dashboard.save.error'));
    }

    dispatch(dashboardSettings.isLoading(false));
  };
}

export const managerFiltersSettings = {
  isLoading: createAction('MEMBERS_DETAILS/FILTERS/IS_LOADING'),
  success: createAction('MEMBERS_DETAILS/FILTERS/SUCCESS'),
  error: createAction('MEMBERS_DETAILS/FILTERS/ERROR'),
};

export function fetchManagerFiltersSettings(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(managerFiltersSettings.isLoading(true));
    dispatch(managerFiltersSettings.error(null));

    try {
      const response = await fetchManagerFiltersSettingsAPI();
      dispatch(managerFiltersSettings.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data);
      }
    } catch (error) {
      console.error(error);
      dispatch(managerFiltersSettings.error(error));
    }
    dispatch(managerFiltersSettings.isLoading(false));
  };
}

export function updateManagerFiltersSettings(filters: object) {
  return async (dispatch: Dispatch) => {
    dispatch(managerFiltersSettings.isLoading(true));
    dispatch(managerFiltersSettings.error(null));

    try {
      const response = await updateManagerFiltersSettingsAPI({ filters });
      dispatch(managerFiltersSettings.success(response.data));
    } catch (error) {
      console.error(error);
      dispatch(managerFiltersSettings.error(error));
    }
    dispatch(managerFiltersSettings.isLoading(false));
  };
}

export const managerRessourcesFilters = {
  isLoading: createAction('RESSOURCES/FILTERS/LOADING'),
  success: createAction('RESSOURCES/FILTERS/SUCCESS'),
  error: createAction('RESSOURCES/FILTERS/ERROR'),
};

export function fetchManagerRessourcesFilters(options: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(managerRessourcesFilters.error(null));
    dispatch(managerRessourcesFilters.isLoading(true));
    try {
      const response = await fetchManagerRessourceFiltersAPI();
      dispatch(managerRessourcesFilters.success(response.data));
      if (options && options.onSuccess) {
        options.onSuccess(response.data.filters[0].filters);
      }
    } catch (err) {
      console.error(err);
      dispatch(managerRessourcesFilters.error(err));
    }
    dispatch(managerRessourcesFilters.isLoading(false));
  };
}

export function updateManagerRessourcesFilters(filters: Object) {
  return async (dispatch: Dispatch) => {
    dispatch(managerRessourcesFilters.error(null));
    dispatch(managerRessourcesFilters.isLoading(true));
    try {
      const response = await updateManagerRessousrcesFiltersAPI({ filters });
      dispatch(managerRessourcesFilters.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(managerRessourcesFilters.error(err));
    }
    dispatch(managerRessourcesFilters.isLoading(false));
  };
}
// ----------------------------------------------------------------
export const dataSourceDashboardGraphMetadataActions = {
  isLoading: createAction('DATA_SOURCE_DASHBOARD/METADATA/LOADING'),
  success: createAction('DATA_SOURCE_DASHBOARD/METADATA/SUCCESS'),
  error: createAction('DATA_SOURCE_DASHBOARD/METADATA/ERROR'),
};

export function fetchDataSourceDashboardGraphMetadata() {
  return async (dispatch: Dispatch) => {
    dispatch(dataSourceDashboardGraphMetadataActions.error(null));
    dispatch(dataSourceDashboardGraphMetadataActions.isLoading(true));
    try {
      const response = await fetchDataSourceDashboardGraphMetadataAPI();
      dispatch(dataSourceDashboardGraphMetadataActions.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(dataSourceDashboardGraphMetadataActions.error(err));
    }
    dispatch(dataSourceDashboardGraphMetadataActions.isLoading(false));
  };
}

export const dataSourceDashboardSettingsActions = {
  isLoading: createAction('DATA_SOURCE_DASHBOARD/SETTINGS/LOADING'),
  success: createAction('DATA_SOURCE_DASHBOARD/SETTINGS/SUCCESS'),
  error: createAction('DATA_SOURCE_DASHBOARD/SETTINGS/ERROR'),
};

export function fetchDataSourceDashboardSettings() {
  return async (dispatch: Dispatch) => {
    dispatch(dataSourceDashboardSettingsActions.error(null));
    dispatch(dataSourceDashboardSettingsActions.isLoading(true));
    try {
      const response = await fetchDataSourceDashboardSettingsAPI();
      const { settings } = response.data;
      dispatch(
        dataSourceDashboardSettingsActions.success(
          settings?.length === 0
            ? defaultDataSourceDashboardConfiguration
            : settings,
        ),
      );
    } catch (err) {
      console.error(err);
      dispatch(dataSourceDashboardSettingsActions.error(err));
    }
    dispatch(dataSourceDashboardSettingsActions.isLoading(false));
  };
}

export function updateDataSourceDashboardSettings(
  settings: DataSourceDashboardSettings,
  options: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(dataSourceDashboardSettingsActions.isLoading(true));
    dispatch(dataSourceDashboardSettingsActions.error(null));

    try {
      const response = await updateDataSourceDashboardSettingsAPI({
        settings,
      });
      const { settings: responseSettings } = response.data;
      dispatch(
        dataSourceDashboardSettingsActions.success(
          responseSettings?.length === 0
            ? defaultDataSourceDashboardConfiguration
            : responseSettings,
        ),
      );
      dispatch(snackbarSuccess('dashboard.save.success'));
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(dataSourceDashboardSettingsActions.error(error));
      dispatch(snackbarError('dashboard.save.error'));
    }

    dispatch(dataSourceDashboardSettingsActions.isLoading(false));
  };
}
