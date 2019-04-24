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
      const SCSs = SCTs.map((sct) => sct.SCS.id)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((scsId) => SCTs.find((sct) => sct.SCS.id === scsId).SCS);
      return state
        .set('SCTs', SCTs)
        .set('SCSs', SCSs)
        .set('easyAccesses', easyAccesses);
    }
    default:
      return state;
  }
}
