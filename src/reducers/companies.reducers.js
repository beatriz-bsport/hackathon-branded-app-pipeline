// @flow

import Immutable from 'seamless-immutable';

import actionTypes from '../actions/companies.types';

const initialState = Immutable({
  company: null,
});

export default function combineReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.COMPANIES_FETCH_SUCCESS:
      return state.merge({
        company: action.company,
      });

    default:
      return state;
  }
}
