import Immutable from 'seamless-immutable';

import actionTypes from '../actions/category.types';

const initialState = Immutable({
  SCTs: [],
});

export default function categoryReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_SCTS:
      return Immutable.merge(state, {
        SCTs: action.SCTs,
      });
    default:
      return state;
  }
}
