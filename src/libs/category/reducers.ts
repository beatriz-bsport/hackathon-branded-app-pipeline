import Immutable from 'seamless-immutable';

import { actions } from './actions';
import { CategoryState, EasyAccess, SCT } from './types';

const initialState: Immutable.Immutable<CategoryState> = Immutable<CategoryState>(
  {
    SCTs: [],
    SCSs: [],
    easyAccesses: [],
  },
);

export default function categoryReducers(
  state = initialState,
  action: any = {},
) {
  switch (action.type) {
    case actions.HAS_FETCHED_SCTS: {
      const {
        SCTs,
        easyAccesses,
      }: { SCTs: SCT[]; easyAccesses: EasyAccess } = action;
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
