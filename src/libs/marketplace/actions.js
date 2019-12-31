// @flow

import { createAction } from 'redux-actions';
import api from './api';
import type { Dispatch } from '../../state/types';

export const companyDetail = {
  error: createAction('MARKETPLACE/DETAIL/ERROR'),
  isLoading: createAction('MARKETPLACE/DETAIL/IS_LOADING'),
  success: createAction('MARKETPLACE/DETAIL/SUCCESS'),
};

export function fetchCompanyAction(companyId: number) {
  return async (dispatch: Dispatch) => {
    dispatch(companyDetail.isLoading(true));
    dispatch(companyDetail.error(null));

    try {
      const response = await api.fetchCompany(companyId);
      const company = response.data;
      dispatch(companyDetail.success(company));
      dispatch(companyDetail.isLoading(false));
    } catch (err) {
      dispatch(companyDetail.error(err));
      dispatch(companyDetail.isLoading(false));
    }
  };
}
