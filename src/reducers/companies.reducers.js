// @flow

import Immutable from 'seamless-immutable';

import type { CompaniesAction, CompaniesState } from '../state/companies/types';

import actionTypes from '../actions/companies.types';

const initialState = Immutable({
  company: null,
});

export default function combineReducers(
  state: CompaniesState = initialState,
  action: CompaniesAction = { type: null },
): CompaniesState {
  switch (action.type) {
    case actionTypes.COMPANIES_FETCH_SUCCESS:
      return state.merge({
        company: action.company,
      });

    default:
      return state;
  }
}
