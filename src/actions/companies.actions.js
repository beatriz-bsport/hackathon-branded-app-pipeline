// @flow

import api from '../api';
import types from './companies.types';

export function actionCompaniesFetchStart() {
  return { type: types.COMPANIES_FETCH_START };
}

export function actionCompaniesFetchSuccess(company) {
  return { type: types.COMPANIES_FETCH_SUCCESS, company };
}

export function actionCompaniesFetchFailure(error) {
  return { type: types.COMPANIES_FETCH_FAILURE, error };
}

export function fetchCompanies() {
  return async (dispatch) => {
    dispatch(actionCompaniesFetchStart());

    try {
      const company = await api.companies.getCompany();

      dispatch(actionCompaniesFetchSuccess(company));
    } catch (error) {
      dispatch(actionCompaniesFetchFailure(error));
    }
  };
}
