import Immutable from 'seamless-immutable';

import { actions } from './actions';
import { CategoryState, SCT } from './types';

const initialState: Immutable.Immutable<CategoryState> =
  Immutable<CategoryState>({
    isLoading: false,
    SCTs: [],
    SCSs: [],
  });

export default function categoryReducers(
  state = initialState,
  action: any = {},
) {
  switch (action.type) {
    case actions.HAS_FETCHED_SCTS: {
      const { SCTs }: { SCTs: SCT[] } = action;
      const SCSs = SCTs.map((sct) => sct.SCS.id)
        .filter((v, i, a) => a.indexOf(v) === i)
        .map((scsId) => SCTs.find((sct) => sct.SCS.id === scsId).SCS);
      return state.set('SCTs', SCTs).set('SCSs', SCSs);
    }
    case actions.isLoading.toString(): {
      const { payload } = action;
      return state.set('isLoading', payload);
    }
    default:
      return state;
  }
}
