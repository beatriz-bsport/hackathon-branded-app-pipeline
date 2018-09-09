import Immutable from 'seamless-immutable';

import actionTypes from '../actions/category.types';

const initialState = Immutable({
  SCTs: [],
  SCSs: [],
});

export default function categoryReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_SCTS: {
      const { SCTs } = action;
      const SCSs = SCTs.filter((v, i, a) => a.indexOf(v) === i);
      return Immutable.merge(state, {
        SCTs,
        SCSs,
      });
    }
    default:
      return state;
  }
}
