import Immutable from 'seamless-immutable';
import { handleActions } from 'redux-actions';
import URI from 'urijs';

import { openUserInteractionPortal } from './actions';

export type ModalState = {
  url: string,
  dialogMode: 0 | 1 | 2,
};

export const initialState: Immutable.Immutable<ModalState> = Immutable<ModalState>(
  {
    url: '',
    dialogMode: 0,
  },
);

export default handleActions<Immutable.Immutable<ModalState>>(
  {
    [openUserInteractionPortal.toString()]: (state, { payload }: any) => {
      const uri = URI(payload.url);
      uri.toString() && uri.addQuery('open_at', Date.now());

      return state
        .setIn(['url'], uri.toString())
        .setIn(['dialogMode'], payload.dialogMode);
    },
  },
  initialState,
);
