import { createAction } from 'redux-actions';
import api from './api';
import type { Dispatch } from '../../state/types';

export const reportGenerationDetail = {
  error: createAction('REPORT/GENERATE/ERROR'),
  isLoading: createAction('REPORT/GENERATE/IS_LOADING'),
  success: createAction('REPORT/GENERATE/SUCCESS'),
};
export function fetchReportGeneration(reportId: ?number, params: any) {
  return async (dispatch: Dispatch) => {
    dispatch(reportGenerationDetail.isLoading(true));
    dispatch(reportGenerationDetail.error(null));

    try {
      const response = await api.fetchReportGeneration(reportId, params);
      dispatch(reportGenerationDetail.success(response.data));
      dispatch(reportGenerationDetail.isLoading(false));
    } catch (err) {
      console.error(err);
      dispatch(reportGenerationDetail.error(err));
      dispatch(reportGenerationDetail.isLoading(false));
    }
  };
}
