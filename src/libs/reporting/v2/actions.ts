import { createAction } from 'redux-actions';
import type {
  ReportConfiguration,
  ReportMetadataValue,
} from '#src/libs/reporting/common/types';
import type { OptionCallback, Dispatch } from '#src/state/types';

import {
  fetchDefaultReports as fetchDefaultReportsAPI,
  fetchReportMetadataV2 as fetchReportMetadataV2API,
} from '#src/libs/reporting/v2/api';

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
