// @flow

import api from '../api';
import types from './companies.types';

import type { Dispatch } from '../state/types';

export function actionCompaniesFetchStart() {
  return { type: types.COMPANIES_FETCH_START };
}

export function actionCompaniesFetchSuccess(company: {}) {
  return { type: types.COMPANIES_FETCH_SUCCESS, company };
}

export function actionCompaniesFetchFailure(error: Error) {
  return { type: types.COMPANIES_FETCH_FAILURE, error };
}

export function fetchCompanies() {
  return async (dispatch: Dispatch) => {
    dispatch(actionCompaniesFetchStart());

    try {
      const company = await api.companies.getCompany();

      dispatch(actionCompaniesFetchSuccess(company));
    } catch (error) {
      dispatch(actionCompaniesFetchFailure(error));
    }
  };
}
