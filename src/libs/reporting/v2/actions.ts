import { createAction } from 'redux-actions';
import type {
  ReportHeader,
  ReportHeaderQueryParams,
  ReportMetadataValue,
  ReportConfiguration,
  ReportSerializerParams,
  ReportFilterConfigParams,
  ReportFilterConfig,
  ReportFilterConfigCreateData,
  ReportUpdateAPI,
  SerializedReport,
  InvalidFiltersAPI,
} from '#src/libs/reporting/common/types';
import type {
  OptionCallback,
  OptionBackgroundCallback,
  Dispatch,
} from '#src/state/types';

import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import { monitorBackgroundTask } from '#src/libs/background-task/actions';
import { displayBackgroundDialog } from '#src/libs/background-dialog/actions';

import {
  fetchDefaultReports as fetchDefaultReportsAPI,
  fetchSerializedReportV2 as fetchSerializedReportV2API,
  fetchReportHeadersV2 as fetchReportHeadersV2API,
  fetchReportMetadataV2 as fetchReportMetadataV2API,
  fetchReportFilterConfigList as fetchReportFilterConfigListAPI,
  createReportFilterConfig as createReportFilterConfigAPI,
  editReportFilterConfig as editReportFilterConfigAPI,
  updateReportV2 as updateReportAPI,
  createReportV2 as createReportAPI,
  deleteReportV2 as deleteReportAPI,
  fetchExcelReporting as fetchExcelReportingAPI,
  getInvalidFilters as getInvalidFiltersAPI,
} from '#src/libs/reporting/v2/api';
import {
  BackgroundDialogActionMode,
  BackgroundDialogDisplayMode,
} from '#src/libs/background-dialog/types';

export const fetchReportsActionsV2 = {
  error: createAction<Error | null>('REPORT_V2/LIST/ERROR'),
  isLoading: createAction<boolean>('REPORT_V2/LIST/IS_LOADING'),
  success: createAction<ReportConfiguration[]>('REPORT_V2/LIST/SUCCESS'),
};

export function fetchDefaultReports(
  options?: OptionCallback<ReportConfiguration[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportsActionsV2.isLoading(true));
    dispatch(fetchReportsActionsV2.error(null));
    try {
      const response = await fetchDefaultReportsAPI();
      dispatch(fetchReportsActionsV2.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchReportsActionsV2.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchReportsActionsV2.isLoading(false));
  };
}

export const fetchReportMetadataActionsV2 = {
  error: createAction<Error | null>('REPORT-V2/METADATA/ERROR'),
  isLoading: createAction<boolean>('REPORT-V2/METADATA/IS_LOADING'),
  success: createAction<ReportMetadataValue[]>('REPORT-V2/METADATA/SUCCESS'),
};

export function fetchReportMetadata(
  options?: OptionCallback<ReportMetadataValue[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportMetadataActionsV2.isLoading(true));

    try {
      const response = await fetchReportMetadataV2API();
      dispatch(fetchReportMetadataActionsV2.success(response.data));

      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(fetchReportMetadataActionsV2.error(error));
      options?.onError?.(error);
    }
    dispatch(fetchReportMetadataActionsV2.isLoading(false));
  };
}

export const createReportActions = {
  error: createAction<Error | null>('REPORT_V2/CREATE/ERROR'),
  isLoading: createAction<boolean>('REPORT_V2/CREATE/IS_LOADING'),
};

export function createReport(
  data: Partial<Omit<ReportConfiguration, 'id'>>,
  options?: OptionCallback<ReportConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createReportActions.isLoading(true));

    try {
      const response = await createReportAPI(data);
      dispatch(snackbarSuccess('reporting:snackbar.createSuccess'));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(createReportActions.error(error));
      dispatch(snackbarError('reporting:snackbar.createError'));
      options?.onError?.(error);
    }
  };
}

export const updateReportActions = {
  error: createAction<Error | null>('REPORT_V2/UPDATE/ERROR'),
  isLoading: createAction<boolean>('REPORT_V2/UPDATE/IS_LOADING'),
};

export function updateReport(
  reportId: number,
  data: ReportUpdateAPI,
  options?: OptionCallback<ReportConfiguration>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(updateReportActions.isLoading(true));

    try {
      const response = await updateReportAPI(reportId, data);
      dispatch(snackbarSuccess('reporting:snackbar.updateSuccess'));
      options?.onSuccess?.(response.data);
    } catch (error) {
      dispatch(updateReportActions.error(error));
      dispatch(snackbarError('reporting:snackbar.updateError'));
      options?.onError?.(error);
    }
    dispatch(updateReportActions.isLoading(false));
  };
}

export const fetchReportFilterConfigListActionsV2 = {
  error: createAction<Error | null>('REPORT_FILTER_V2/LIST/ERROR'),
  isLoading: createAction<boolean>('REPORT_FILTER_V2/LIST/IS_LOADING'),
  success: createAction<ReportFilterConfig[]>('REPORT_FILTER_V2/LIST/SUCCESS'),
};

export function fetchReportFilterConfigList(
  params: ReportFilterConfigParams,
  options?: OptionCallback<ReportFilterConfig[]>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportFilterConfigListActionsV2.isLoading(true));

    try {
      const response = await fetchReportFilterConfigListAPI(params);

      dispatch(
        fetchReportFilterConfigListActionsV2.success(response.data.results),
      );
      options?.onSuccess?.(response.data.results);
    } catch (error) {
      options?.onError?.(error);
      dispatch(fetchReportFilterConfigListActionsV2.error(error));
    }
    dispatch(fetchReportFilterConfigListActionsV2.isLoading(false));
  };
}

export const createReportFilterConfigActionsV2 = {
  error: createAction<Error | null>('REPORT_FILTER_V2/CREATE/ERROR'),
  isLoading: createAction<boolean>('REPORT_FILTER_V2/CREATE/IS_LOADING'),
  success: createAction<ReportFilterConfig>('REPORT_FILTER_V2/CREATE/SUCCESS'),
};

export function createReportFilterConfig(
  data: ReportFilterConfigCreateData,
  options?: OptionCallback<ReportFilterConfig>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createReportFilterConfigActionsV2.isLoading(true));
    try {
      const response = await createReportFilterConfigAPI(data);

      dispatch(createReportFilterConfigActionsV2.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
    }
    dispatch(createReportFilterConfigActionsV2.isLoading(false));
  };
}

export const editReportFilterConfigActionsV2 = {
  error: createAction<Error | null>('REPORT_FILTER_V2/EDIT/ERROR'),
  isLoading: createAction<boolean>('REPORT_FILTER_V2/EDIT/IS_LOADING'),
  success: createAction<ReportFilterConfig>('REPORT_FILTER_V2/EDIT/SUCCESS'),
};

export function editReportFilterConfig(
  reportFilterConfigId: number,
  data: Partial<ReportFilterConfig>,
  options?: OptionCallback<ReportFilterConfig>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editReportFilterConfigActionsV2.isLoading(true));

    try {
      const response = await editReportFilterConfigAPI(
        reportFilterConfigId,
        data,
      );

      dispatch(editReportFilterConfigActionsV2.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (error) {
      options?.onError?.(error);
      dispatch(editReportFilterConfigActionsV2.error(error));
    }
    dispatch(editReportFilterConfigActionsV2.isLoading(false));
  };
}

export const deleteReportActionsV2 = {
  error: createAction<Error | null>('REPORT-V2/DELETE/ERROR'),
  isLoading: createAction<boolean>('REPORT-V2/DELETE/IS_LOADING'),
  success: createAction('REPORT-V2/DELETE/SUCCESS'),
};

export function deleteReport(reportId: number, options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteReportActionsV2.isLoading(true));

    try {
      await deleteReportAPI(reportId);
      dispatch(snackbarSuccess('reporting:snackbar.deleteSuccess'));
      dispatch(deleteReportActionsV2.success());
      options?.onSuccess?.();
    } catch (error) {
      dispatch(deleteReportActionsV2.error(error));
      dispatch(snackbarError('reporting:snackbar.deleteError'));
      options?.onError?.(error);
    }
    dispatch(deleteReportActionsV2.isLoading(false));
  };
}
export const reportHeadersDetailV2 = {
  error: createAction<Error | null>('REPORT-V2/HEADERS/ERROR'),
  isLoading: createAction<boolean>('REPORT-V2/HEADERS/IS_LOADING'),
  success: createAction<ReportHeader>('REPORT-V2/HEADERS/SUCCESS'),
};

export function fetchReportHeaders(
  reportId: number,
  params: ReportHeaderQueryParams,
) {
  return async (dispatch: Dispatch) => {
    dispatch(reportHeadersDetailV2.isLoading(true));
    dispatch(reportHeadersDetailV2.error(null));
    try {
      const response = await fetchReportHeadersV2API(reportId, params);
      dispatch(reportHeadersDetailV2.success(response.data));
    } catch (err) {
      dispatch(reportHeadersDetailV2.error(err));
    }
    dispatch(reportHeadersDetailV2.isLoading(false));
  };
}

export const reportGenerationDetailV2 = {
  error: createAction<Error | null>('REPORT-V2/GENERATE/ERROR'),
  isLoading: createAction<boolean>('REPORT-V2/GENERATE/IS_LOADING'),
  success: createAction<SerializedReport>('REPORT-V2/GENERATE/SUCCESS'),
};

export function fetchSerializedReport(
  reportId: number,
  params: ReportSerializerParams,
  options?: OptionCallback<SerializedReport>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(reportGenerationDetailV2.isLoading(true));
    dispatch(reportGenerationDetailV2.error(null));

    try {
      const response = await fetchSerializedReportV2API(reportId, params);
      dispatch(reportGenerationDetailV2.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(reportGenerationDetailV2.error(err));
      options?.onError?.(err);
    }
    dispatch(reportGenerationDetailV2.isLoading(false));
  };
}

export const resetReportGenerationAction = {
  success: createAction('REPORT_V2/RESET_GENERATION/SUCCESS'),
};

export const resetReportGenerationState = () => {
  return (dispatch: Dispatch) => {
    dispatch(resetReportGenerationAction.success());
  };
};

export const exportingExcelReportActionsV2 = {
  isLoading: createAction('REPORT_V2/EXPORT_EXCEL/IS_LOADING'),
  error: createAction('REPORT_V2/EXPORT_EXCEL/ERROR'),
};

export function exportExcelReport(
  id: number,
  params: any,
  options?: OptionBackgroundCallback<string> & {
    backgroundDialog?: {
      message: string;
      title: string;
    };
  },
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportingExcelReportActionsV2.isLoading(true));
    dispatch(exportingExcelReportActionsV2.error(null));
    try {
      const response = await fetchExcelReportingAPI(id, params);
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];

      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            options?.onBackgroundSuccess?.();
            dispatch(exportingExcelReportActionsV2.isLoading(false));
            dispatch(
              displayBackgroundDialog(
                backgroundTaskUuid,
                options?.backgroundDialog?.title,
                options?.backgroundDialog?.message,
                response.data,
                BackgroundDialogActionMode.DOWNLOAD,
                BackgroundDialogDisplayMode.INFORMATION,
                'common:close',
              ),
            );
          },
          onError: (error) => {
            dispatch(exportingExcelReportActionsV2.error(error));
            dispatch(exportingExcelReportActionsV2.isLoading(false));
            options?.onBackgroundError?.();
          },
        }),
      );
    } catch (error) {
      dispatch(exportingExcelReportActionsV2.error(error));
      dispatch(exportingExcelReportActionsV2.isLoading(false));
      options?.onError?.();
    }
  };
}

export const reportGetInvalidFiltersV2 = {
  error: createAction<Error | null>('REPORT-V2/INVALID_FILTERS/ERROR'),
  isLoading: createAction<boolean>('REPORT-V2/INVALID_FILTERS/IS_LOADING'),
  success: createAction<InvalidFiltersAPI>('REPORT-V2/INVALID_FILTERS/SUCCESS'),
};

export function getInvalidFilters(
  reportId: number,
  options?: OptionCallback<InvalidFiltersAPI>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(reportGetInvalidFiltersV2.isLoading(true));
    try {
      const response = await getInvalidFiltersAPI(reportId);
      dispatch(reportGetInvalidFiltersV2.success(response.data));
      options?.onSuccess?.(response.data);
    } catch (err) {
      console.error(err);
      dispatch(reportGetInvalidFiltersV2.error(err));
      options?.onError?.(err);
    } finally {
      dispatch(reportGetInvalidFiltersV2.isLoading(false));
    }
  };
}
