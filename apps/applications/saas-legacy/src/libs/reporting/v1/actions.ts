import { Dispatch, OptionCallback } from '#src/state/types';
import { createAction } from 'redux-actions';

import { fetchReportOfferManagement as fetchReportOfferManagementAPI } from './api';

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
