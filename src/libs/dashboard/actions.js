// @flow

import { createAction } from 'redux-actions';
import dashboardGraphsRaw from './dashboardGraphs';
import {
  fetchDashboardSettings as fetchDashboardSettingsAPI,
  updateDashboardSettings as updateDashboardSettingsAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '../../actions/snackbar.actions';
import type { Dispatch, OptionCallback } from '../../state/types.ts';
import type { Tab } from './types';

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
            settings: dashboardGraphsRaw,
          }),
        );
      } else {
        dispatch(dashboardSettings.success(response.data));
      }
      if (options && options.onSuccess) options.onSuccess();
    } catch (error) {
      console.error(error);
      dispatch(dashboardSettings.error(error));
    }

    dispatch(dashboardSettings.isLoading(false));
  };
}

export function updateDashboardSettings(
  settings: Array<Tab>,
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
