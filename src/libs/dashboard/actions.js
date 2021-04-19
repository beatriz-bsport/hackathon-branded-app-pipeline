// @flow

import { createAction } from 'redux-actions';
import defaultDashboardConfiguration from './dashboardGraphs';
import {
  fetchDashboardSettings as fetchDashboardSettingsAPI,
  updateDashboardSettings as updateDashboardSettingsAPI,
  fetchManagerFiltersSettings as fetchManagerFiltersSettingsAPI,
  updateManagerFiltersSettings as updateManagerFiltersSettingsAPI,
  fetchManagerRessourceFilters as fetchManagerRessourceFiltersAPI,
  updateManagerRessousrcesFilters as updateManagerRessousrcesFiltersAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import type { Dispatch, OptionCallback } from '../../state/types';

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
