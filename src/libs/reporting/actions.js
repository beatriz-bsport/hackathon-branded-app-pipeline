import { createAction } from 'redux-actions';
import api from './api';
import { OptionCallback, Dispatch } from '../../state/types';
import { monitorBackgroundTask } from '../background-task/actions';
import { displayBackgroundDialog } from '../../actions/backgroundDialog.actions';

export const reportGenerationDetail = {
  error: createAction('REPORT/GENERATE/ERROR'),
  isLoading: createAction('REPORT/GENERATE/IS_LOADING'),
  success: createAction('REPORT/GENERATE/SUCCESS'),
};
export function fetchReportGeneration(reportId: ?number, params: any, options) {
  return async (dispatch: Dispatch) => {
    dispatch(reportGenerationDetail.isLoading(true));
    dispatch(reportGenerationDetail.error(null));

    try {
      const response = await api.fetchReportGeneration(reportId, params);
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

export function fetchReportHeaders(reportId: ?number, params: any) {
  return async (dispatch: Dipsatch) => {
    dispatch(reportHeadersDetail.isLoading(true));
    dispatch(reportHeadersDetail.error(null));
    try {
      const response = await api.fetchReportHeaders(reportId, params);
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
  options?: OptionCallback,
) {
  return async (dispatch: Dispatch) => {
    dispatch(exportingExcelReportActions.isLoading(true));
    dispatch(exportingExcelReportActions.error(null));
    try {
      const response = await api.fetchExcelReporting(id, params);
      dispatch(exportingExcelReportActions.success(response.data));
      const backgroundTaskUuid = response.headers['x-background-task-uuid'];
      dispatch(
        monitorBackgroundTask(backgroundTaskUuid, {
          onSuccess: () => {
            if (options.closeInitialDialog) options.closeInitialDialog();
            dispatch(
              displayBackgroundDialog(
                backgroundTaskUuid,
                options.backgroundDialog.message,
                options.backgroundDialog.title,
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
