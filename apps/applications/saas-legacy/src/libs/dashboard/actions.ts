import { createAction } from 'redux-actions';

import { getDefaultDataSourceDashboardSettings } from './defaultDataSourceDashboardSettings';
//@ts-expect-error
import defaultDashboardConfiguration from './dashboardGraphs';
import {
  fetchDashboardSettings as fetchDashboardSettingsAPI,
  fetchManagerFiltersSettings as fetchManagerFiltersSettingsAPI,
  updateManagerFiltersSettings as updateManagerFiltersSettingsAPI,
  fetchManagerScheduleResourceFilters as fetchManagerScheduleResourceFiltersAPI,
  updateManagerScheduleResourcesFilters as updateManagerScheduleResourcesFiltersAPI,
  // -------------------------------------------------------------------
  fetchDataSourceDashboardGraphMetadata as fetchDataSourceDashboardGraphMetadataAPI,
  fetchDataSourceDashboardSettings as fetchDataSourceDashboardSettingsAPI,
  updateDataSourceDashboardSettings as updateDataSourceDashboardSettingsAPI,
} from './api';
import { snackbarSuccess, snackbarError } from '#src/libs/snackbar/actions';
import type { Dispatch, OptionCallback } from '#src/state/types';

import type {
  DataSourceDashboardSettings,
  MyScheduleRessourceValueType,
  MyResourceFilters,
  MyRessourceScheduleFilters,
} from '#src/libs/dashboard/types';

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
      //@ts-expect-error
      const { settings } = response.data;
      if (!settings.length) {
        dispatch(
          dashboardSettings.success({
            //@ts-expect-error
            ...response.data,
            settings: defaultDashboardConfiguration,
          }),
        );
      } else {
        dispatch(dashboardSettings.success(response.data));
      }
      //@ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (error) {
      console.error(error);
      dispatch(dashboardSettings.error(error));
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
        //@ts-expect-error
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

/* =========================== SCHEDULE RESOURCES =========================== */
export const managerScheduleRessourcesFilters = {
  isLoading: createAction<boolean>('RESSOURCES/SCHEDULE/FILTERS/LOADING'),
  success: createAction<MyResourceFilters>(
    'RESSOURCES/SCHEDULE/FILTERS/SUCCESS',
  ),
  error: createAction<Error | null>('RESSOURCES/SCHEDULE/FILTERS/ERROR'),
};

export function fetchManagerScheduleResourceFilters(
  options: OptionCallback<MyScheduleRessourceValueType[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(managerScheduleRessourcesFilters.error(null));
    dispatch(managerScheduleRessourcesFilters.isLoading(true));
    try {
      const response = await fetchManagerScheduleResourceFiltersAPI();
      dispatch(managerScheduleRessourcesFilters.success(response.data));

      options?.onSuccess?.(response.data.filters[0].filters);
    } catch (err) {
      console.error(err);
      options?.onError?.();
      dispatch(managerScheduleRessourcesFilters.error(err));
    }
    dispatch(managerScheduleRessourcesFilters.isLoading(false));
  };
}

export function updateManagerScheduleResourcesFilters(
  filters: [MyRessourceScheduleFilters],
) {
  return async (dispatch: Dispatch) => {
    dispatch(managerScheduleRessourcesFilters.error(null));
    dispatch(managerScheduleRessourcesFilters.isLoading(true));
    try {
      const response = await updateManagerScheduleResourcesFiltersAPI({
        filters,
      });
      dispatch(managerScheduleRessourcesFilters.success(response.data));
    } catch (err) {
      console.error(err);
      dispatch(managerScheduleRessourcesFilters.error(err));
    }
    dispatch(managerScheduleRessourcesFilters.isLoading(false));
  };
}
/* =========================== SCHEDULE RESOURCES =========================== */

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
      //@ts-expect-error
      const { settings } = response.data;
      dispatch(
        dataSourceDashboardSettingsActions.success(
          settings?.length === 0
            ? getDefaultDataSourceDashboardSettings()
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
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(dataSourceDashboardSettingsActions.isLoading(true));
    dispatch(dataSourceDashboardSettingsActions.error(null));

    try {
      const response = await updateDataSourceDashboardSettingsAPI({
        settings,
      });
      //@ts-expect-error
      const { settings: responseSettings } = response.data;
      dispatch(
        dataSourceDashboardSettingsActions.success(
          responseSettings?.length === 0
            ? getDefaultDataSourceDashboardSettings()
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
