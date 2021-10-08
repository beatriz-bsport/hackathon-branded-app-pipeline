import { createAction } from 'redux-actions';
import { OptionCallback, Dispatch } from '../../state/types';
import { monitorBackgroundTask } from '../background-task/actions';
import { displayBackgroundDialog } from '../../actions/backgroundDialog.actions';
import {
  fetchReportGeneration as fetchReportGenerationAPI,
  fetchReportHeaders as fetchReportHeadersAPI,
  fetchExcelReporting as fetchExcelReportingAPI,
  fetchReports as fetchReportsAPI,
  fetchReportMetadata as fetchReportMetadataAPI,
  deleteReport as deleteReportAPI,
  updateReport as updateReportAPI,
  createReport as createReportAPI,
} from './api';
import { ReportConfiguration } from './types';

export const reportGenerationDetail = {
  error: createAction('REPORT/GENERATE/ERROR'),
  isLoading: createAction('REPORT/GENERATE/IS_LOADING'),
  success: createAction('REPORT/GENERATE/SUCCESS'),
};
export function fetchReportGeneration(
  reportId: number,
  params: any,
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(reportGenerationDetail.isLoading(true));
    dispatch(reportGenerationDetail.error(null));

    try {
      const response = await fetchReportGenerationAPI(reportId, params);
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
