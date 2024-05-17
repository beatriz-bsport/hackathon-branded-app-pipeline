import { createAction } from 'redux-actions';
import {
  OptionCallback,
  Dispatch,
  OptionPaginatedCallback,
} from '../../state/types';
import { monitorBackgroundTask } from '../background-task/actions';
import { displayBackgroundDialog } from '../background-dialog/actions';
import {
  fetchSerializedReport as fetchSerializedReportAPI,
  fetchReportHeaders as fetchReportHeadersAPI,
  fetchExcelReporting as fetchExcelReportingAPI,
  fetchReports as fetchReportsAPI,
  fetchReportMetadata as fetchReportMetadataAPI,
  deleteReport as deleteReportAPI,
  updateReport as updateReportAPI,
  createReport as createReportAPI,
  fetchReportOfferManagement as fetchReportOfferManagementAPI,
  createReportFilterConfig as createReportFilterConfigAPI,
  editReportFilterConfig as editReportFilterConfigAPI,
  fetchReportFilterConfigList as fetchReportFilterConfigListAPI,
  deleteReportFilterConfig as deleteReportFilterConfigAPI,
} from './api';
import {
  ReportConfiguration,
  ReportFilterConfig,
  ReportFilterConfigParams,
  ReportSerializerParams,
} from '#libs/reporting/types';

export const reportGenerationDetail = {
  error: createAction('REPORT/GENERATE/ERROR'),
  isLoading: createAction('REPORT/GENERATE/IS_LOADING'),
  success: createAction('REPORT/GENERATE/SUCCESS'),
};
export function fetchSerializedReport(
  reportId: number,
  params: ReportSerializerParams,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(reportGenerationDetail.isLoading(true));
    dispatch(reportGenerationDetail.error(null));

    try {
      const response = await fetchSerializedReportAPI(reportId, params);
      dispatch(
        reportGenerationDetail.success({
          [reportId]: response.data,
        }),
      );
      dispatch(reportGenerationDetail.isLoading(false));
      if (options && options.onSuccess) options.onSuccess();
    } catch (err) {
      console.error(err);
      dispatch(reportGenerationDetail.error(err));
      dispatch(reportGenerationDetail.isLoading(false));
      if (options && options.onError) options.onError();
    }
  };
}

export const reportHeadersDetail = {
  error: createAction('REPORT/HEADERS/ERROR'),
  isLoading: createAction('REPORT/HEADERS/IS_LOADING'),
  success: createAction('REPORT/HEADERS/SUCCESS'),
};

export function fetchReportHeaders(reportId: number, params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(reportHeadersDetail.isLoading(true));
    dispatch(reportHeadersDetail.error(null));
    try {
      const response = await fetchReportHeadersAPI(reportId, params);
      dispatch(reportHeadersDetail.success({ [reportId]: response.data }));
      dispatch(reportHeadersDetail.isLoading(false));
    } catch (err) {
      dispatch(reportHeadersDetail.error(err));
      dispatch(reportHeadersDetail.isLoading(false));
    }
  };
}

export const exportingExcelReportActions = {
  isLoading: createAction('EXPORT_EXCEL/IS_LOADING'),
  error: createAction('EXPORT_EXCEL/ERROR'),
  success: createAction('EXPORT_EXCEL/SUCCESS'),
  create: createAction('EXPORT_EXCEL/CREATE'),
};

export function exportExcelReport(
  id: number,
  params: any,
  options?: OptionCallback & {
    closeInitialDialog: () => void;
    backgroundDialog?: {
      message: string;
      title: string;
    };
  },
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportingExcelReportActions.isLoading(true));
    dispatch(exportingExcelReportActions.error(null));
    try {
      const response = await fetchExcelReportingAPI(id, params);
      dispatch(exportingExcelReportActions.success(response.data));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options?.closeInitialDialog) options.closeInitialDialog();
            dispatch(
              displayBackgroundDialog(
                backgroundTaskUuid,
                options?.backgroundDialog?.message,
                options?.backgroundDialog?.title,
                // @ts-expect-error
                response.data,
              ),
            );
          },
        }),
      );
    } catch (err) {
      dispatch(exportingExcelReportActions.error(err));
      if (options && options.onError) options.onError();
    }
    dispatch(exportingExcelReportActions.isLoading(false));
  };
}

export const fetchReportOfferManagementActions = {
  isLoading: createAction('EXPORT_EXCEL/OFFER_MANAGEMENT/IS_LOADING'),
  error: createAction('EXPORT_EXCEL/OFFER_MANAGEMENT/ERROR'),
  success: createAction('EXPORT_EXCEL/OFFER_MANAGEMENT/SUCCESS'),
  create: createAction('EXPORT_EXCEL/OFFER_MANAGEMENT/CREATE'),
};

export function fetchReportOfferManagement(
  params: {
    coach_in?: number[];
    establishment_in?: number[];
    level_in?: number[];
    activity_in?: number[];
    date: string;
  },
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportOfferManagementActions.isLoading(true));
    dispatch(fetchReportOfferManagementActions.error(null));
    try {
      const response = await fetchReportOfferManagementAPI(params);

      dispatch(fetchReportOfferManagementActions.success(response.data));
      dispatch(fetchReportOfferManagementActions.isLoading(false));
      // @ts-expect-error
      if (options && options.onSuccess) options.onSuccess(response.data);
    } catch (err) {
      dispatch(fetchReportOfferManagementActions.error(err));
      dispatch(fetchReportOfferManagementActions.isLoading(false));
      if (options && options.onError) options.onError();
    }
    dispatch(fetchReportOfferManagementActions.isLoading(false));
  };
}

export const fetchReportsActions = {
  error: createAction('REPORT/LIST/ERROR'),
  isLoading: createAction('REPORT/LIST/IS_LOADING'),
  success: createAction('REPORT/LIST/SUCCESS'),
};

export function fetchReports(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportsActions.isLoading(true));

    try {
      const response = await fetchReportsAPI();
      dispatch(
        fetchReportsActions.success({
          results: response.data,
        }),
      );

      options?.onSuccess();
    } catch (error) {
      dispatch(fetchReportsActions.error(error));
      if (typeof options?.onError === 'function') options?.onError(error);
    }
  };
}

export const fetchReportMetadataActions = {
  error: createAction('REPORT/METADATA/ERROR'),
  isLoading: createAction('REPORT/METADATA/IS_LOADING'),
  success: createAction('REPORT/METADATA/SUCCESS'),
};

export function fetchReportMetadata(options?: OptionCallback) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportMetadataActions.isLoading(true));

    try {
      const response = await fetchReportMetadataAPI();
      dispatch(
        fetchReportMetadataActions.success({
          results: response.data,
        }),
      );

      options?.onSuccess();
    } catch (error) {
      dispatch(fetchReportMetadataActions.error(error));
      if (typeof options?.onError === 'function') options?.onError(error);
    }
  };
}

export const deleteReportActions = {
  error: createAction('REPORT/DELETE/ERROR'),
  isLoading: createAction('REPORT/DELETE/IS_LOADING'),
  success: createAction('REPORT/DELETE/SUCCESS'),
};

export function deleteReport(props: {
  reportId: number;
  options?: OptionCallback;
}) {
  const { reportId, options } = props;

  return async (dispatch: Dispatch) => {
    dispatch(deleteReportActions.isLoading(true));

    try {
      await deleteReportAPI(reportId);

      dispatch(deleteReportActions.success());
      dispatch(fetchReports());
      options?.onSuccess();
    } catch (error) {
      dispatch(deleteReportActions.error(error));
      if (typeof options?.onError === 'function') options?.onError(error);
    }
  };
}

export const createReportActions = {
  error: createAction('REPORT/create/ERROR'),
  isLoading: createAction('REPORT/create/IS_LOADING'),
  success: createAction('REPORT/create/SUCCESS'),
};

export function createReport(props: {
  data: ReportConfiguration;
  options?: OptionCallback<number>;
}) {
  const { data, options } = props;

  return async (dispatch: Dispatch) => {
    dispatch(createReportActions.isLoading(true));

    try {
      const response = await createReportAPI(data);

      dispatch(createReportActions.success());
      dispatch(fetchReports());

      if (typeof options?.onSuccess === 'function') {
        // @ts-expect-error
        options?.onSuccess(response.data);
      }
    } catch (error) {
      dispatch(createReportActions.error(error));
      if (typeof options?.onError === 'function') options?.onError(error);
    }
  };
}

export const updateReportActions = {
  error: createAction('REPORT/UPDATE/ERROR'),
  isLoading: createAction('REPORT/UPDATE/IS_LOADING'),
  success: createAction('REPORT/UPDATE/SUCCESS'),
};

export function updateReport(props: {
  reportId: number;
  data: ReportConfiguration;
  options?: OptionCallback;
}) {
  const { reportId, data, options } = props;

  return async (dispatch: Dispatch) => {
    dispatch(updateReportActions.isLoading(true));

    try {
      await updateReportAPI(reportId, data);

      dispatch(updateReportActions.success());
      dispatch(fetchReports());
      options?.onSuccess();
    } catch (error) {
      dispatch(updateReportActions.error(error));
      if (typeof options?.onError === 'function') options?.onError(error);
    }
  };
}

export const createReportFilterConfigActions = {
  error: createAction('REPORT_FILTER/CREATE/ERROR'),
  isLoading: createAction('REPORT_FILTER/CREATE/IS_LOADING'),
  success: createAction('REPORT_FILTER/CREATE/SUCCESS'),
};

export function createReportFilterConfig(
  reportId: number,
  // @ts-expect-error
  data: Omit<ReportFilterConfig, ['id', 'report']>,
  options?: OptionCallback<ReportFilterConfig>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(createReportFilterConfigActions.isLoading(true));
    dispatch(createReportFilterConfigActions.error(null));
    try {
      const response = await createReportFilterConfigAPI({
        report: reportId,
        ...data,
      });

      dispatch(createReportFilterConfigActions.success(response.data));
      dispatch(createReportFilterConfigActions.isLoading(false));
      options?.onSuccess(response.data);
    } catch (error) {
      options?.onError(error);
      dispatch(createReportFilterConfigActions.error(error));
      dispatch(createReportFilterConfigActions.isLoading(false));
    }
  };
}

export const editReportFilterConfigActions = {
  error: createAction('REPORT_FILTER/EDIT/ERROR'),
  isLoading: createAction('REPORT_FILTER/EDIT/IS_LOADING'),
  success: createAction('REPORT_FILTER/EDIT/SUCCESS'),
};

export function editReportFilterConfig(
  reportFilterConfigId: number,
  data: Omit<ReportFilterConfig, 'id'>,
  options?: OptionCallback<ReportFilterConfig>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(editReportFilterConfigActions.isLoading(true));

    try {
      const response = await editReportFilterConfigAPI(
        reportFilterConfigId,
        // @ts-expect-error
        data,
      );

      dispatch(editReportFilterConfigActions.success(response.data));
      dispatch(editReportFilterConfigActions.isLoading(false));
      options?.onSuccess(response.data);
    } catch (error) {
      options?.onError(error);
      dispatch(editReportFilterConfigActions.error(error));
      dispatch(editReportFilterConfigActions.isLoading(false));
    }
  };
}

export const fetchReportFilterConfigListActions = {
  error: createAction('REPORT_FILTER/LIST/ERROR'),
  isLoading: createAction('REPORT_FILTER/LIST/IS_LOADING'),
  success: createAction('REPORT_FILTER/LIST/SUCCESS'),
};

export function fetchReportFilterConfigList(
  params: ReportFilterConfigParams,
  options?: OptionPaginatedCallback<ReportFilterConfig>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(fetchReportFilterConfigListActions.isLoading(true));

    try {
      const response = await fetchReportFilterConfigListAPI(params);

      dispatch(
        fetchReportFilterConfigListActions.success(
          // @ts-expect-error
          response.data?.results ?? response.data,
        ),
      );
      dispatch(fetchReportFilterConfigListActions.isLoading(false));
      // @ts-expect-error
      options?.onSuccess(response.data);
    } catch (error) {
      options?.onError(error);
      dispatch(fetchReportFilterConfigListActions.error(error));
      dispatch(fetchReportFilterConfigListActions.isLoading(false));
    }
  };
}

export const deleteReportFilterConfigActions = {
  error: createAction('REPORT_FILTER/DELETE/ERROR'),
  isLoading: createAction('REPORT_FILTER/DELETE/IS_LOADING'),
  success: createAction('REPORT_FILTER/DELETE/SUCCESS'),
};

export function deleteReportFilterConfig(
  reporFilterId: number,
  options?: OptionPaginatedCallback<ReportFilterConfig>,
) {
  return async (dispatch: Dispatch) => {
    dispatch(deleteReportFilterConfigActions.isLoading(true));

    try {
      await deleteReportFilterConfigAPI(reporFilterId);

      dispatch(deleteReportFilterConfigActions.success(reporFilterId));
      dispatch(deleteReportFilterConfigActions.isLoading(false));
      options?.onSuccess();
    } catch (error) {
      options?.onError(error);
      dispatch(deleteReportFilterConfigActions.error(error));
      dispatch(deleteReportFilterConfigActions.isLoading(false));
    }
  };
}
