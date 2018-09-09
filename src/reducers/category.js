import Immutable from 'seamless-immutable';

import actionTypes from '../actions/category.types';

const initialState = Immutable({
  SCTs: [],
  SCSs: [],
  easyAccesses: [],
});

export default function categoryReducers(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.HAS_FETCHED_SCTS: {
      const { SCTs, easyAccesses } = action;
      const SCSs = SCTs.filter((v, i, a) => a.indexOf(v) === i);
      return Immutable.merge(state, {
        SCTs,
        SCSs,
        easyAccesses,
      });
    }
    default:
      return state;
  }
}
